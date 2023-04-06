import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../../models/index.js';
import session from 'express-session';
// import Users from '../../models/users.js';

export const googleStrategy = passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            // accessType: 'offline',
        },
        async (accessToken, refreshToken, profile, done) => {
            // console.log('구글 프로필 상세보기 : ', profile);
            // console.log('제일 처음 리프레시 토큰 생성 확인하는 곳', refreshToken); // 리프레시 토큰 확인
            try {
                const exUser = await db.Users.findOne({
                    where: {
                        email: profile._json.email,
                    },
                });
                if (exUser) {
                    exUser.access_token = accessToken;
                    exUser.refresh_token = refreshToken;
                    // console.log('여기는 로그인시 만들어진 엑세스 토큰', accessToken);
                    // console.log('여기는 로그인시 만들어진 리프레시 토큰', refreshToken);
                    return done(null, { accessToken, refreshToken, profile });
                } else {
                    const newUser = await db.Users.create({
                        email: profile._json.email,
                        username: profile._json.name,
                        profile_img: profile._json.picture,
                        login_type: 'google',
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });
                    // console.log('새롭게 생성된 유저 정보 : ', newUser);
                    // console.log('새롭게 엑세스 토큰이 잘 만들어졌는지 : ', accessToken);
                    // console.log('새롭게 리프레시 토큰이 만들어 졌는지 : ', refreshToken);
                    return done(null, { accessToken, refreshToken, profile });
                }
            } catch (error) {
                console.error('로그인 혹은 회원가입시 발생한 오류는 : ', error);
                done(error);
            }
        }
    )
);

export const googleLoginCheck = passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ],
    accessType: 'offline',
    prompt: 'consent',
});

export const googleCallback = passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}`,
    session: false,
});
