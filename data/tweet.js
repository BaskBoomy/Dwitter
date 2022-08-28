import Mongoose from "mongoose";
import {useVirtualId} from "../db/database.js";
import {findById} from "./auth.js";

const tweetSchema = new Mongoose.Schema({
    text: {type:String, required:true},
    userId: {type:String, required:true},
    name: {type:String, required:true},
    username: {type:String, required:true},
    url: String,
  }, {timestamps: true} //자동으로 createdAt updatedAt 컬럼 생성
  );

//_id -> id : 가상으로 컬럼명이'id'인 컬럼 생성하기
useVirtualId(tweetSchema);
const Tweet = Mongoose.model('Tweet', tweetSchema);

export async function getAll(){
    return Tweet.find().sort({createdAt:-1});
}
export async function getAllByUsername(username){
    return Tweet.find({username}).sort({createdAt:-1});
}
export async function getById(id){
    return Tweet.findById(id);
}
export async function create(text, userId){
    return findById(userId)
        .then((user)=>{
            new Tweet({text,userId,name:user.name,username:user.username})
            .save()
        })
}

export async function update(id,text){
    //returnOriginal->false: 업데이트된것을 return하기위한 설정
    return Tweet.findByIdAndUpdate(id,{text},{returnOriginal: false});
}

export async function remove(id){
    return Tweet.findByIdAndDelete(id);
}