import express from 'express';
import 'express-async-error';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import tweetRouter from './router/tweets.js';
import authRouter from './router/auth.js';
import {config} from './config.js';
import {initSocket} from './connection/socket.js'
import {sequelize} from './db/database.js';
import { csrfCheck } from './middleware/csrf.js';
import { modulePathResolver } from 'express-openapi-validator/dist/resolvers.js';
import { authHandler } from './middleware/auth.js';
import rateLimiter from './middleware/rate-limiter.js';
import yaml from 'yamljs';
import swaggerUI from 'swagger-ui-express';
import * as OpenAPIValidator from 'express-openapi-validator';
import * as apis from './controller/index.js';

const app = express();
const corsOption = {
    origin: config.cors.allowedOrigin,
    optionsSuccessStatus: 200,
    credentials: true, // allow the Access-Control-Allow-Credentials
};
app.use(cors(corsOption));

const openAPIDocument = yaml.load('./api/openapi.yaml'); //json으로 변환
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('tiny'));
app.use(rateLimiter);
app.use(csrfCheck);

app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(openAPIDocument)); //api 문서화
app.use('/tweets',tweetRouter);
app.use('/auth',authRouter);

//tweet과 auth에 정의되어있지 않은 api일 경우 문서에 정의되어있는 API 사용
app.use(
    //Routing과 Validating까지 해줌.
    OpenAPIValidator.middleware({
        apiSpec: './api/openapi.yaml',
        validateResponses: true,
        operationHandlers:{
            resolver: modulePathResolverd,
        },
        validateSecurity:{
            handlers:{
                jwt_auth: authHandler
            }
        }
    })
)
function modulePathResolverd(_, route, apiDoc){
    //문서에서 Api경로 가져오기
    const pathKey = route.openApiRoute.substring(route.basePath.length);
    //문서에서 method 가져오기(ex post,get)
    const operation = apiDoc.paths[pathKey][route.method.toLowerCase()];
    //문서에서 Api이름 가져오기
    const methodName = operation.operationId;
    //index.js(정의해놓은 모든 api)에서 api를 찾아서 반환
    return apis[methodName];
}
app.use((req, res, next) => {
    res.sendStatus(404);
})

app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status || 500)
        .json({message: error.message});
})
// db.getConnection();

//sync() : 모델과 모델에서 정의한 스키마가 데이터베이스에 테이블로 존재하지않으면 자동으로 생성해주는 함수
sequelize.sync().then(() => {
    console.log('server started');
    //db에 연결하고 서버 시작
    const server = app.listen(config.host.port);
    initSocket(server);
});
