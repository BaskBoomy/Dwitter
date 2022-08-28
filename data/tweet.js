import { getTweets } from '../db/database.js';
import * as userRepository from './auth.js';
import MongoDB from 'mongodb';

const ObjectId = MongoDB.ObjectId;
export async function getAll() {
    return getTweets()
        .find()
        .sort({createdAt:-1})
        .toArray()
        .then(mapTweets);
}
export async function getAllByUsername(username) {
    return getTweets()
        .find({username})
        .sort({createdAt:-1})
        .toArray()
        .then(mapTweets);
}
export async function getById(id) {
    return getTweets()
        .findOne({_id:new ObjectId(id)})
        .then(mapOptionalTweet);
}
export async function create(text, userId) {
    //NOSQL 성질을 유지하기 위해 USER정보 가져옴 -> 중복데이터 > 관계형
    const {name,username,url} = await userRepository.findById(userId);
    const tweet = {
        text,
        createdAt: new Date(),
        userId,
        name,
        username,
        url,
    }
    return getTweets()
        .insertOne(tweet)
        .then(data=>mapOptionalTweet({...tweet,_id:data.insertedId}));
}

export async function update(id, text) {
    return getTweets()
        .findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set:{text}},
            {returnDocument: 'after'} //수정이된 다음의 객체를 return
        )
        .then(data =>{
            console.log(mapOptionalTweet(data.value));
            return mapOptionalTweet(data.value);
        });
}

export async function remove(id) {
    return getTweets().deleteOne({_id: new ObjectId(id)});
}

function mapOptionalTweet(tweet){
    return tweet ? {...tweet,id:tweet._id.toString()} : tweet;
}

function mapTweets(tweets){
    return tweets.map(mapOptionalTweet);
}