import SQ from 'sequelize';
import { config } from '../config.js';

const {host, port,user, database, password} = config.db;

//sequelize 연결
export const sequelize = new SQ.Sequelize(database, user, password, {
    host,
    port,
    dialect: 'postgres',
    logging:false,
    dialectOptions:{
        ssl:{
            require:true,
            rejectUnauthorized:false,
        }
    }
})

// const pool = mysql.createPool({
//     host,
//     user,
//     database,
//     password,
// });
// export const db = pool.promise();