import {config} from '../config.js';
import bcrypt from 'bcrypt';

export const csrfCheck = (req, res, next)=>{
    //변경을 시도하지 않은 요청은 무시 == POST,PUT,DELETE..만 처리한다.
    if(
        req.method === 'GET' ||
        req.method === 'OPTIONS' ||
        req.method === 'HEAD'
    ){
        return next();
    }

    const csrfHeader = req.get('dwitter-csrf-token');

    if(!csrfHeader){
        console.warn('Missing required "dwitter-csrf-token" header.', req.headers.origin);
        return res.status(403).json({message: 'Faild CSRF check'});
    }

    validateCsrfToken(csrfHeader)
        .then((valid)=>{
            if(!valid){
                console.warn(
                    'Value provided in "dwitter-csrf-token" header does not validate.',
                    req.headers.origin,
                    csrfHeader
                );
                return res.status(403).json({message: 'Faild CSRF check'});
            }
            next();
        })
        .catch((err)=>{
            console.log(err);
            return res.status(500).json({message: 'Somthing went wrong'});
        })
}

async function validateCsrfToken(csrfHeader){
    return bcrypt.compare(config.csrf.plainToken, csrfHeader);
}