import jwt from 'jsonwebtoken';
import db from '../../models/index.js';

class jwtService {
    // Access Token 생성
    createAccessToken = (userData) => {
        return jwt.sign(userData, process.env.JWT_SECRET_KEY, {
            expiresIn: '3h',
        });
    };
    // Refresh Token 생성
    createKakaoToken = (token) => {
        return jwt.sign({
            login_type: 'kakao',
            token,
        }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    };

    createGoogleToken = (token) => {
        return jwt.sign({
            login_type: 'google',
            token
        }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    };

    createUwreckcarToken = (token) => {
        return jwt.sign({
            login_type: 'uwreckcar',
            token
        }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    };

    getTokenPayload = (token) => {
        try {
            return jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (error) {
            return false;
        }
    };

    // Access Token 검증
    validateAccessToken = (accessToken) => {
        try {
            jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
            return true;
        } catch (error) {
            return false;
        }
    };

    // Refresh Token 검증
    validateRefreshToken = (refreshToken) => {
        try {
            jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
            return true;
        } catch (error) {
            return false;
        }
    };
}

export default new jwtService();
