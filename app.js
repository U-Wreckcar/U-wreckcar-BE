import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import RedisStore from 'connect-redis';
import redisClient from './src/config/redis.config.js';
import helmet from 'helmet';
import { kakaoStrategy } from './src/config/kakaoStrategy.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { router as UserRouter } from './src/routes/userRouter.js';
import { router as UTMRouter } from './src/routes/utmRouter.js';
import rateLimit from 'express-rate-limit';
// import { exportDataToExcel } from './src/controllers/utm/exportDataToExcel.js';
import db from './models/index.js';
import { run as mongodb } from './config/mongo.config.js';

const app = express();
app.use(helmet());

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

// mongoDB initial
mongodb()
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => console.error(err));

// Redis initial
redisClient.flushdb((err) => {
    if (err) {
        console.error('Error flushing Redis: ', err);
    } else {
        console.log('Redis session data cleared.');
    }
});

// 세션 설정
app.use(
    session({
        store: new RedisStore({
            client: redisClient,
            prefix: 'session:',
            disableTouch: true,
        }),
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24, // 쿠키의 만료 기간을 설정합니다. 여기서는 24시간으로 설정했습니다.
        },
    })
);
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

const allowedOrigins = [`${process.env.CLIENT_URL}`, `${process.env.CLIENT_LOCAL}`];
// CORS
app.use(
    cors({
        origin: (origin, callback) => {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

// Rate limiter 설정
const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10분
    max: 1000, // 각 IP당 허용 요청 수
    message: '과도한 요청으로 인해 일시적으로 사용이 제한되었습니다. 나중에 다시 시도하세요.',
});

// Rate limiter 미들웨어
app.use(apiLimiter);

// 카카오 로그인 전략 설정
passport.use(kakaoStrategy);

// Router
app.use(UserRouter);
app.use(UTMRouter);

app.use('error', (err, req, res, next) => {
    console.error('Error : ', err);
    res.status(500).json({
        errorName: err.name,
        errorMessage: err.message,
        errorStack: err.stack,
    });
});

app.listen(process.env.SERVER_PORT, () => {
    // process.send('ready');
    console.log(`Server is listening on ${process.env.SERVER_PORT}`);
});
