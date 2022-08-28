import jwt from 'jsonwebtoken';
import * as userRepository from '../data/auth.js';
import {config} from '../config.js';

const AUTH_ERROR = {};

export const isAuth = async (req,res,next)=>{
    const authHeader = req.get('Authorization');
    if(!(authHeader && authHeader.startsWith('Bearer '))){
        return res.status(401).json({message : 'Authentication Error',detail:'header string error'});
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        config.jwt.secretKey,
        async (error, decoded) =>{
            if(error){
                return res.status(401).json({message : 'Authentication Error',detail:error});
            }
            const user = await userRepository.findById(decoded.id);
            if(!user){
                return res.status(401).json({message : 'Authentication Error',detail:'cannot find user'});
            }
            req.userId = user.id;
            next();
        }
    )
}