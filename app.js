import express from 'express';
import 'express-async-error';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import tweetRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import {config} from './config.js';
import {initSocket} from './connection/socket.js'
import {sequelize} from './db/database.js';

const app = express();
app.use(cors());

app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));

app.use('/tweets',tweetRouter);
app.use('/auth',authRouter);

app.use((req, res, next) => {
    res.sendStatus(404);
})

app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
})
// db.getConnection();

//sync() : 모델과 모델에서 정의한 스키마가 데이터베이스에 테이블로 존재하지않으면 자동으로 생성해주는 함수
sequelize.sync().then(() => {
    // console.log(client);
    //db에 연결하고 서버 시작
    const server = app.listen(5432);
    initSocket(server);
});
