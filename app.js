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
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error destroying session.');
        }

        // 쿠키를 삭제하려면 클라이언트에서 해당 쿠키의 만료 날짜를 과거로 설정해야 합니다.
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

app.use('error', (err, req, res) => {
    console.log(err);
    res.status(500).send({
        message: 'error',
    });
});

app.listen(process.env.SERVER_PORT, () =>
    console.log(`Server listening on ${process.env.SERVER_PORT}`)
);
