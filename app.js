import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { kakaoStrategy } from './src/config/kakaoStrategy.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { router as UserRouter } from './src/routes/userRouter.js';
import { router as UTMRouter } from './src/routes/utmRouter.js';
// import { exportDataToExcel } from './src/controllers/utm/exportDataToExcel.js';
import http from 'http'
import https from 'https'
import fs from 'fs'
import db from './models/index.js';

const app = express();

// 서버 실행 환경 & 로그 레벨 설정
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}
console.log(process.env.NODE_ENV);

// MySQL initial
db.sequelize
    .sync({ force: false })
    .then(() => {
        console.log('MySQL connected.');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(express.json());
app.use(cookieParser());

// headers 설정
app.use(function (req, res, next) {
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers':
            'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, authorization, refreshToken, cache-control',
    });
    next();
});

// CORS
app.use(
    cors({
        origin: '*',
    })
);

// 세션 설정
app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: process.env.NODE_ENV === 'production' },
    })
);

// 카카오 로그인 전략 설정
passport.use(kakaoStrategy);

// Router
app.use(UserRouter);
app.use(UTMRouter);

app.use('error', (err, req, res) => {
    console.log(err);
    res.status(500).send({
        message: 'error',
    });
});

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    // 프로덕션 환경인 경우 HTTPS 서버 생성
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/uwreckcar-api.site/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/uwreckcar-api.site/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/uwreckcar-api.site/chain.pem', 'utf8');

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(process.env.SERVER_PORT, () => {
        console.log(`HTTPS server is running on port ${process.env.SERVER_PORT}`);
    });

} else {
    // 개발 환경인 경우 HTTP 서버 생성
    const httpServer = http.createServer(app);
    httpServer.listen(process.env.SERVER_PORT, () => {
        console.log(`HTTP server is running on port ${process.env.SERVER_PORT}`);
    });
}
