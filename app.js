import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
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

app.use(express.json());
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

// 세션 설정
app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: process.env.NODE_ENV === 'production' },
    })
);

// Rate limiter 설정
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1분
    max: 60, // 각 IP당 허용 요청 수
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
    `Server is listening on ${process.env.SERVER}`;
});
