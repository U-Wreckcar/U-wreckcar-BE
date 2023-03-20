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

// headers 설정
app.use(function (req, res, next) {
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': `${process.env.CLIENT_URL}`,
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers':
            'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, authorization, refreshToken, cache-control',
    });
    next();
});

// CORS
app.use(
    cors({
        origin: `${process.env.CLIENT_URL}`,
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

// 카카오 로그인 전략 설정
passport.use(kakaoStrategy);

// Router
app.use(UserRouter);
app.use(UTMRouter);

app.listen(process.env.SERVER_PORT, () => {
    `Server is listening on ${process.env.SERVER}`;
});
