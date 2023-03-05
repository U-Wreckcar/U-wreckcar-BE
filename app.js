import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { router as UserRouter } from './src/routes/userRouter.js';
import { router as UTMRouter } from './src/routes/utmRouter.js';
// import { exportDataToExcel } from './src/controllers/utm/exportDataToExcel.js';

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}

console.log(process.env.NODE_ENV)
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);

app.use(UserRouter);
app.use(UTMRouter);

app.get('/', async (req, res) => {
    try {
        res.send('Hi !!');
    } catch (error) {
        console.error(error);
        res.status(500).send('노 하이');
    }
});


// app.get('/export/excell', async (req, res) => {
//     try {
//         console.log("url 시작")
//         exportDataToExcel();
//         res.send('엑셀파일 익스퍼트가 잘 되었습니다');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('엑셀파일 익스퍼트가 실패하였습니다.');
//     }
// });

app.listen(process.env.SERVER_PORT, () =>
    console.log(`Server listening on ${process.env.SERVER_PORT}`)
);
