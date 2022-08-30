import express from 'express';
import 'express-async-error';
import * as authController from '../controller/auth.js';
import {body, param, validationResult} from 'express-validator';
import {validate} from '../middleware/validator.js';
import {isAuth} from '../middleware/auth.js';


const router = express.Router();

router.use(express.json());

const validateLogin = [
    body('username').trim().isLength({min:2}).withMessage('이름은 최소 2'),
    body('password').trim().isLength({min:5}).withMessage('최소 5글자'),
    validate
];
router.post('/login',validateLogin,authController.login);

//TODO : Swagger 문서 이용
// const validateSignUp = [
//     ...validateLogin,
//     body('name').notEmpty().withMessage('name is missing'),
//     body('email').isEmail().normalizeEmail().withMessage('invalid email'),
//     body('url').isURL().withMessage('invalid URL').optional({nullable:true, checkFalsy:true}),
//     validate
// ];
// router.post('/signup',validateSignUp,authController.signup);

router.post('/logout',authController.logout);
router.get('/me',isAuth, authController.me);
router.get('/csrf-token', authController.csrfToken);
export default router;