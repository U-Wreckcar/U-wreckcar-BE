import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../../models/index.js';
import session from 'express-session';
// import Users from '../../models/users.js';

export const googleStrategy = passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_ID, // 구글 로그인에서 발급받은 REST API 키
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: '/auth/google/callback', // 구글 로그인 Redirect URI 경로
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log('구글 프로필 상세보기 : ', profile);
            try {
                const exUser = await db.Users.findOne({
                    // 구글 플랫폼에서 로그인 했고 & snsId필드에 구글 아이디가 일치할경우
                    where: {
                        email: profile._json.email,
                        // provider: 'google',
                    },
                });
                // 이미 가입된 구글 프로필이면 성공
                if (exUser) {
                    // console.log('여기는 스토리지에서 만들어진 토큰',token);
                    return done(null, { access_token: accessToken, refresh_token: refreshToken }); // 로그인 인증 완료
                } else {
                    // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
                    const newUser = await db.Users.create({
                        email: profile._json.email,
                        username: profile._json.name,
                        profile_img: profile._json.picture,
                        // provider: 'google',
                    });
                    console.log('새롭게 생성된 유저 정보 : ', newUser);
                    console.log('엑세스 토큰이 잘 만들어졌는지 : ', accessToken);
                    console.log('리프레시 토큰이 만들어 졌는지 : ', refreshToken);
                    return done(null, newUser, {
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    }); // 회원가입하고 로그인 인증 완료
                }
            } catch (error) {
                console.error('로그인 혹은 회원가입시 발생한 오류는 : ', error);
                done(error);
            }
        }
    )
);

export const googleLoginCheck = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleCallback = passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}`,
    session: false,
});
