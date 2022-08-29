import dotenv from 'dotenv';
dotenv.config();

//서버 시작 전에 미리 개발자에게 알려주기
function required(key, defaultValue = undefined){
    const value = process.env[key] || defaultValue;
    if(value == null){
        throw new Error(`Key ${key} is undefined`);
    }
    return value;
}

export const config = {
    jwt :{
        secretKey: required('JWT_SECRET'),
        expiresInSec : parseInt(required('JWT_EXPIRES_SEC',172800)),
    },
    bcrypt:{
        saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12))
    },
    host:{
        port:parseInt(required('PORT', 8080)),
    },
    db:{
        host: required('DB_HOST'),
        user: required('DB_USER'),
        database:required('DB_DATABASE'),
        password:required('DB_PASSWORD'),
        port: required('DB_PORT')
    },
    cors:{
        allowedOrigin: required('CORS_ALLOW_ORIGIN')
    }
}