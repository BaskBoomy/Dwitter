import * as userRepository from '../data/auth.js';
import {  sequelize } from '../db/database.js';
import SQ from 'sequelize';
import { User } from './auth.js';

// DB QUERY를 입력하여 데이터 입출력
// const SELECT_JOIN = 
//     'SELECT T.id, T.text, T.createdAt, T.userId, U.username, U.name, U.url FROM tweets AS T JOIN users AS U ON T.userId = U.id';
// const ORDER_DESC = 
//     'ORDER BY t.createdAt DESC';

const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;
const Tweet = sequelize.define('tweet', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
})
//user테이블의 id와 연결 : userId 컬럼 생성
Tweet.belongsTo(User);

const INCLUDE_USER = {
    attributes: [
        'id', 
        'text', 
        'createdAt', 
        'userId', 
        [Sequelize.col('user.name'), 'name'],
        [Sequelize.col('user.username'), 'username'],
        [Sequelize.col('user.url'), 'url'],
    ],
    include: {
        model: User,
        attributes: []
    },
}
const ORDER_DESC = {
    order:[['createdAt', 'DESC']]
}
export async function getAll() {
    return Tweet.findAll({...INCLUDE_USER,...ORDER_DESC});
    // return db
    //     .execute(`${SELECT_JOIN} ${ORDER_DESC}`)
    //     .then((result)=>{
    //         console.log(result);
    //         return result[0];
    // })
}
export async function getAllByUsername(username) {
    return Tweet.findAll({...INCLUDE_USER, ...ORDER_DESC, include:{
        ...INCLUDE_USER.include,
        where:{username},
    }});
    // return db
    //     .execute(`${SELECT_JOIN} WHERE username=?  ${ORDER_DESC}`, [username])
    //     .then((result) => {
    //         console.log(result);
    //         return result[0];
    //     })
}
export async function getById(id) {
    return Tweet.findOne({
        where:{id},
        ...INCLUDE_USER,
    });
    // return db
    //     .execute(`${SELECT_JOIN} WHERE t.id=?`, [id])
    //     .then((result) => {
    //         console.log(result);
    //         return result[0][0];
    //     })
}
export async function create(text, userId) {
    return Tweet.create({ text, userId })
    .then(data => this.getById(data.dataValues.id));
    // return db
    // .execute(
    //     'INSERT INTO tweets (text,createdAt, userId) VALUES(?,?,?)',
    //     [text,new Date(),userId]
    // )
    // .then((result)=> getById(result[0].insertId));
}

export async function update(id, text) {
    return Tweet.findByPk(id, INCLUDE_USER)
    .then(tweet=>{
        tweet.text = text;
        return tweet.save();
    })
    // return db
    //     .execute(
    //         'UPDATE tweets SET text=? WHERE id=?', [text, id]
    //     )
    //     .then(() => getById(id));
}

export async function remove(id) {
    return Tweet.findByPk(id, INCLUDE_USER)
    .then(tweet=>{
        tweet.destroy();
    })
    // return db
    //     .execute(
    //         'DELETE FROM tweets WHERE id=?', [id]
    //     )
    //     .then(() => {
    //         console.log('Deleted Success :)');
    //     });
}