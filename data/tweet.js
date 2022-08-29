import * as userRepository from '../data/auth.js';
import { db } from '../db/database.js';

const SELECT_JOIN = 
    'SELECT T.id, T.text, T.createdAt, T.userId, U.username, U.name, U.url FROM tweets AS T JOIN users AS U ON T.userId = U.id';
const ORDER_DESC = 
    'ORDER BY t.createdAt DESC';

export async function getAll(){
    return db
        .execute(`${SELECT_JOIN} ${ORDER_DESC}`)
        .then((result)=>{
            console.log(result);
            return result[0];
    })
}
export async function getAllByUsername(username){
    return db
        .execute(`${SELECT_JOIN} WHERE username=?  ${ORDER_DESC}`, [username])
        .then((result)=>{
            console.log(result);
            return result[0];
    })
}
export async function getById(id){
    return db
        .execute(`${SELECT_JOIN} WHERE t.id=?`, [id])
        .then((result)=>{
            console.log(result);
            return result[0][0];
    })
}
export async function create(text, userId){
    return db
    .execute(
        'INSERT INTO tweets (text,createdAt,updatedAt, userId) VALUES(?,?,?,?)',
        [text,new Date(),new Date(),userId]
    )
    .then((result)=> getById(result[0].insertId));
}

export async function update(id,text){
    return db
    .execute(
        'UPDATE tweets SET text=? WHERE id=?',[text, id]
    )
    .then(()=> getById(id));
}

export async function remove(id){
    return db
    .execute(
        'DELETE FROM tweets WHERE id=?',[id]
    )
    .then(()=>{
        console.log('Deleted Success :)');
    });
}