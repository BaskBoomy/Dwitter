import express from 'express';
import 'express-async-error';
import * as tweetController from '../controller/tweet.js';
import {body, param, validationResult} from 'express-validator';
import {validate} from '../middleware/validator.js';
import {isAuth} from '../middleware/auth.js';

const router = express.Router();
router.use(express.json());
const validateTweet = 
[
    body('text').trim().isLength({min:3}).withMessage('3글자 이상!'),
    validate
];

//GET /tweets
//GET /tweets?username=:username
//TODO : Swagger 문서 이용
// router.get('/', isAuth, tweetController.getTweets)

//GET /tweets/:id
router.get('/:id', isAuth, tweetController.getTweet)

//POST /tweets
router.post('/', isAuth, validateTweet,tweetController.createTweet)

//PUT /tweets/:id
router.put('/:id', isAuth, validateTweet,tweetController.updateTweet)

//DELETE /tweets/:id
router.delete('/:id', isAuth, tweetController.deleteTweet)
export default router;