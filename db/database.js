import SQ from 'sequelize';
import { config } from '../config.js';

const {host, user, database, password} = config.db;

//sequelize 연결
export const sequelize = new SQ.Sequelize(database, user, password, {
    host,
    dialect: 'mysql',
    logging:false
})

// const pool = mysql.createPool({
//     host,
//     user,
//     database,
//     password,
// });
// export const db = pool.promise();