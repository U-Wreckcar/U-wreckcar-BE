import express from 'express';
import { asyncWrapper } from '../../utils/middleware.js';
import { getUserProfile } from '../controllers/user/getUserProfile.js';
import { kakaoAuth, redirectURI } from '../controllers/user/kakaoLogin.js';

const router = express.Router();

// kakao 로그인
router.get('/auth/kakao', asyncWrapper(redirectURI));
router.get('/auth/kakao/callback', asyncWrapper(kakaoAuth));

// 회원
router.get('/api/user/profile', asyncWrapper(getUserProfile));
router.post('/api/user/profile', () => {});

export { router };
