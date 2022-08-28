import { getSocketIO } from '../connection/socket.js';
import * as tweetRepository from '../data/tweet.js';
//컨트롤러 : 모델과 통신하고있는 데이터를 받아오고 데이터가 잘못되었을 때 어떻게 에러를 보여줄지만 결정
export async function getTweets(req,res,next){
    const username = req.query.username;
    const data = await(username 
        ? await tweetRepository.getAllByUsername(username) 
        : await tweetRepository.getAll());
    res.status(200).json(data);
}

export async function getTweet(req, res, next){
    const id = req.params.id;
    const tweet = await tweetRepository.getById(id);
    if(tweet){
        res.status(200).json(tweet);
    }else{
        res.status(404).json({message:`Tweet Id:${id} not found`});
    }
}

export async function createTweet(req,res,next){
    const {text} = req.body;
    const newTweet = await tweetRepository.create(text,req.userId);
    //- req.userId
    //1. isAuth middleware에서 jwtoken으로 인증하여 받아온 사용자 id
    //2. req에 userId의 값에 받아온 id값을 넣어준다.
    res.status(201).json(newTweet);
    getSocketIO().emit('tweets', newTweet);
}

export async function updateTweet(req, res, next){
    const id = req.params.id;
    const text = req.body.text;

    const tweet = await tweetRepository.getById(id);
    if(!tweet){
        return res.sendStatus(404);
    }
    if(tweet.userId !== req.userId){
        return res.sendStatus(403)
    }
    const updated = await tweetRepository.update(id,text);
    res.status(200).json(updated);
}

export async function deleteTweet(req,res,next){
    const id = req.params.id;
    const tweet = await tweetRepository.getById(id);
    if(!tweet){
        return res.sendStatus(404);
    }
    if(tweet.userId !== req.userId){
        return res.sendStatus(403)
    }
    await tweetRepository.remove(id);
    res.sendStatus(204);
}