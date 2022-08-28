import {db} from '../db/database.js';

export async function findByUsername(username){
    return db
        .query(
            `SELECT * FROM users WHERE username=?`,
            [username])
        .then((result)=>result[0][0])
}

export async function findById(userId){
    return db
        .query(
            `SELECT * FROM users WHERE id=?`,
            [userId])
        .then((result)=>result[0][0])
}

export async function createUser(newUser){
    const {username, password,name, email,url} = newUser;
    return db
    .execute(
        'INSERT INTO users (username, password, name, email, url) VALUES(?,?,?,?,?)'
        ,[username, password,name, email,url])
    .then((result)=> result[0].insertId);
}