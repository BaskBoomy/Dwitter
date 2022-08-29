import express from 'express';
import 'express-async-error';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import tweetRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import {config} from './config.js';
import {initSocket} from './connection/socket.js'
import { db } from './db/database.js';

const app = express();

const corsOption = {
    origin: config.cors.allowedOrigin,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOption));

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
db.getConnection().then(()=>{
    console.log(`Server is started... ${new Date()}`);
    const server = app.listen(config.port);
    initSocket(server);
});
