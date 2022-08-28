import mysql from 'mysql2';
import SQ from 'sequelize';
import { config } from '../config.js';

const {host, user, database, password} = config.db;

//연결
export const sequelize = new SQ.Sequelize(database, user, password, {
    host,
    dialect: 'mysql',
})
const pool = mysql.createPool({
    host,
    user,
    database,
    password,
});

export const db = pool.promise();