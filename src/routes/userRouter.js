import express from 'express';
import passport from 'passport';
import { asyncWrapper, authPassport } from '../../utils/middleware.js';
import { getUserProfile } from '../controllers/user/getUserProfile.js';

const router = express.Router();

// kakao 로그인
router.get('/auth/kakao', authPassport);
router.get('/auth/kakao/callback', authPassport, (req, res, next) => {
    console.log(process.env.CLIENT_URL);
    res.redirect('/');
});

// 회원
router.get('/api/user/profile', asyncWrapper(getUserProfile));
router.post('/api/user/profile', () => {});

export { router };
