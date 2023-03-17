import { Strategy as KakaoStrategy } from 'passport-kakao';
import passport from 'passport';

export const kakaoStrategy = new KakaoStrategy(
    {
        clientID: process.env.REST_API_KEY,
        clientSecret: process.env.CLIENT_SECRET_KEY,
        callbackURL: process.env.REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = profile._json
            return done(null, { access_token: accessToken, refresh_token: refreshToken, user });
        } catch (error) {
            return done(error);
        }
    }
);

export const kakaoLogin = passport.authenticate('kakao', {
    scope: ['profile_nickname', 'profile_image', 'account_email'],
});
export const kakaoCallback = passport.authenticate('kakao', {
    failureRedirect: `${process.env.CLIENT_URL}`,
    session: false,
});
