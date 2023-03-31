import express from 'express';
import passport from 'passport';
import { asyncWrapper, authenticate } from '../../utils/middleware.js';
import { getUserProfile } from '../controllers/user/getUserProfile.js';
import { kakaoLogin, kakaoCallback } from '../config/kakaoStrategy.js';
import { alreadyExists } from '../modules/user.module.js';
import jwtService from '../modules/jwt.module.js'
import { sendEmailController, signupForCompanyController } from '../controllers/user/companySignup.js';
import { googleLoginCheck, googleStrategy } from '../passport/googleStrategy.js';
import { googleCallback } from '../passport/googleStrategy.js';
const router = express.Router();

// kakao 로그인
router.get('/api/auth/kakao', kakaoLogin);
router.get('/api/auth/kakao/callback', kakaoCallback, async (req, res) => {
    try {
        const { access_token, refresh_token, user } = req.user;
        console.log('AccessToken : ', access_token);
        console.log('RefreshToken : ', refresh_token);

        // 기존 회원 확인 후 새로 가입.
        await alreadyExists(user);
        res.status(200).send({ access_token: access_token, refresh_token: refresh_token });
    } catch (err) {
        console.error(err);
        res.status(500).send({ errorMessage: err.message, stack: err.stack });
    }
});

// 회원
router.get('/api/users/profile', authenticate, asyncWrapper(getUserProfile));
router.post('/api/users/signup', asyncWrapper(signupForCompanyController));
router.post('/api/users/email', asyncWrapper(sendEmailController));

router.get('/api/auth/google', googleLoginCheck); // 프로파일과 이메일 정보를 받는다.
// 위에서 구글 서버 로그인이 되면, 구글 redirect url 설정에 따라 이쪽 라우터로 오게 된다. 인증 코드를 박게됨
router.get('/auth/google/callback', googleCallback, async (req, res) => {
    try {
        const { access_token, refresh_token } = req.user;
        res.status(200).send({ access_token: access_token, refresh_token: refresh_token });
    } catch (err) {
        console.log(err);
        res.status(500).send({ errorMessage: err.message });
    }
});
export { router };
