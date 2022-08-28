import {getUsers} from '../db/database.js';
import MongoDB from 'mongodb';

const ObjectId = MongoDB.ObjectId;

export async function findByUsername(username){
    return getUsers()
        .findOne({username})
        .then(data=>{
            return mapOptionalUser(data);
        });
}

export async function findById(id){
    return getUsers()
        .findOne({_id:new ObjectId(id)})
        .then(mapOptionalUser);
}

export async function createUser(newUser){
    return getUsers().insertOne(newUser).then(data => {
        console.log(data.insertedId.toString());
        return data.insertedId.toString();
    });
}

function mapOptionalUser(user){
    return user ? {...user,id:user._id.toString()} : user;
}