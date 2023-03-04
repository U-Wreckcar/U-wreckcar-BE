import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { router as UserRouter } from './src/routes/userRouter.js';
import { router as UTMRouter } from './src/routes/utmRouter.js';

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}

console.log(process.env.NODE_ENV);
app.use(express.json());
app.use(cookieParser());

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
app.use(
    cors({
        origin: '*',
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new KakaoStrategy(
        {
            clientID: process.env.REST_API_KEY,
            clientSecret: process.env.CLIENT_SECRET_KEY,
            callbackURL: process.env.REDIRECT_URI,
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile);
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(UserRouter);
app.use(UTMRouter);

app.get('/export/excell', async (req, res) => {
    try {
        await exportDataToExcel();
        res.send('엑셀파일 익스퍼트가 잘 되었습니다');
    } catch (error) {
        console.error(error);
        res.status(500).send('엑셀파일 익스퍼트가 실패하였습니다.');
    }
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
