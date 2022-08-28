import SQ from 'sequelize';
import {sequelize} from '../db/database.js';

//sequelize를 이용하여 데이터베이스에 테이블 생성
const DataTypes = SQ.DataTypes;
export const User = sequelize.define('user',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true
    },
    username:{
        type:DataTypes.STRING(45),
        allowNull : false,
    },
    password:{
        type:DataTypes.STRING(128),
        allowNull : false,
    },
    name:{
        type:DataTypes.STRING(128),
        allowNull : false,
    },
    email:{
        type:DataTypes.STRING(128),
        allowNull : false,
    },
    url:{
        type:DataTypes.TEXT,
    },
},{timestamps:false});


export async function findByUsername(username){
    return User.findOne({where:{username}});
    // return db
    //     .query(
    //         `SELECT * FROM users WHERE username=?`,
    //         [username])
    //     .then((result)=>result[0][0])
}

export async function findById(id){
    return User.findByPk(id);
    // return db
    //     .query(
    //         `SELECT * FROM users WHERE id=?`,
    //         [id])
    //     .then((result)=>result[0][0])
}

export async function createUser(newUser){
    return User.create(newUser).then(data=> data.dataValues.id);
    // const {username, password,name, email,url} = newUser;
    // return db
    // .execute(
    //     'INSERT INTO users (username, password, name, email, url) VALUES(?,?,?,?,?)'
    //     ,[username, password,name, email,url])
    // .then((result)=> result[0].insertId);
}