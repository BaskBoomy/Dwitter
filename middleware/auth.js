import jwt from 'jsonwebtoken';
import * as userRepository from '../data/auth.js';
import {config} from '../config.js';

const AUTH_ERROR = {message : 'Authentication Error'};

export const isAuth = async (req,res,next)=>{
    // 1. Browser : Cookie가 header에 있는지 확인
    // 2. Non-Browser : Header 검사

    let token;
    // header 검사
    const authHeader = req.get('Authorization');
    if(authHeader && authHeader.startsWith('Bearer ')){
        token = authHeader.split(' ')[1];
    }

    // header에 token이 없다면 cookie 확인
    if(!token){
        token = req.cookies['token'];
    }

    if(!token){
        return res.status(401).json(AUTH_ERROR);
    }

    jwt.verify(
        token,
        config.jwt.secretKey,
        async (error, decoded) =>{
            if(error){
                return res.status(401).json(AUTH_ERROR);
            }
            const user = await userRepository.findById(decoded.id);
            if(!user){
                return res.status(401).json(AUTH_ERROR);
            }
            req.userId = user.id;
            next();
        }
    )
}

export const authHandler = async(req) =>{
    const authHeader = req.get('Authorization');
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, config.jwt.secretKey);
        const user = await userRepository.findById(decoded.id);
        if(!user){
            throw{status : 401, ...AUTH_ERROR};
        }
        req.userId = user.id;
        req.token = decoded;
        return true;
    }catch(err){
        console.error(err);
        throw{status:401, ...AUTH_ERROR};
    }
}