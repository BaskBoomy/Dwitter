import * as userRepository from "../data/auth.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {config} from '../config.js';

export async function signup(req,res){
    const {username,email,password,name,url} = req.body;
    const found = await userRepository.findByUsername(username);
    if(found){
        return res.status(409).json({message:`${username} is already exists`});
    }
    const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
    const userId = await userRepository.createUser({
        username,
        email,
        password:hashed,
        name,
        url,
    })
    const token = createJwtToken(userId);
    setToken(res, token);
    res.status(201).json({token, username});
}

export async function login(req,res){
    const {username, password} = req.body;
    const user = await userRepository.findByUsername(username);
    if(!user){
        return res.status(401).json({message:'Invalid user or password'});
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
        return res.status(401).json({message:'Invalid user or password'});
    }

    const token = createJwtToken(user.id);
    setToken(res, token);
    res.status(200).json({token, username});
}

export async function logout(req, res, next){
    res.cookie('token', '');
    res.status(200).json({message:'User has been logged out'});
}
export async function me(req,res){
    const user = await userRepository.findById(req.userId);
    if(!user){
        return res.status(404).json({messag:'User not found'});
    }
    res.status(200).json({token: req.token, username: user.username});
}

export async function csrfToken(req,res){
    const csrfToken = await generateCSRFToken();
    res.status(200).json({csrfToken});
}

async function generateCSRFToken(){
    return bcrypt.hash(config.csrf.plainToken, 1);
}

function createJwtToken(id){
    return jwt.sign({id}, config.jwt.secretKey, {expiresIn: config.jwt.expiresInSec});
}

function setToken(res, token){
    const options = {
        maxAge: config.jwt.expiresInSec * 1000,
        httpOnly: true,
        sameSite: 'none', //server와 client가 동일한 domain이 아니더라도 http-only가 동작
        secure: true,
    }
    res.cookie('token', token, options) // HTTP-ONLY
}