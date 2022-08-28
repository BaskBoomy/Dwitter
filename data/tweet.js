import * as userRepository from '../data/auth.js';
let tweets = [
    {
        id : "1",
        text : "Hello Jack",
        createdAt : new Date().toString(),
        userId : '1'
    },    
    {        
        id : "2",
        text : "Hello Jina",
        createdAt : new Date().toString(),
        userId : '1'
    },    
    {        
        id : "3",
        text : "Hello Jack",
        createdAt : new Date().toString(),
        userId : '1'
    },
];

export async function getAll(){
    return Promise.all(
        tweets.map(async(tweet)=>{
            const {username, name, url} = await userRepository.findById(tweet.userId);
            return {...tweet, username, name, url};
        })
    );
}
export async function getAllByUsername(username){
    return getAll().then((tweets)=>
        tweets.filter((t) => t.username === username)
    );
}
export async function getById(id){
    const found = tweets.find((t) => t.id === id);
    if(!found){
        return null;
    }
    const {username, name, url} = await userRepository.findById(found.userId);
    return {...found, username,name,url};
}
export async function create(text, userId){
    const newTweet = {
        "id" : Date.now().toString(),
        "text" : text,
        "createdAt" : new Date(),
        "userId" : userId,
    }
    //배열 맨앞에 새로운 데이터 넣기
    tweets = [newTweet, ...tweets];
    return getById(newTweet.id);
}

export async function update(id,text){
    const tweet = tweets.find((t) => t.id === id);
    if(tweet){
        tweet.text = text;
    }
    return getById(tweet.id);
}

export async function remove(id){
    tweets = tweets.filter( t => t.id !== id);
}