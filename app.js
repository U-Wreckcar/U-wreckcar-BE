import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);

const router = require('./routes/router');
app.use('/api', router);

app.get('/', async (req, res) => {
    console.log(req.body);
    res.status(200).send('Ok.');
});


app.get('/export/excell', async (req, res) => {
    try {
      await exportDataToExcel();
      res.send('엑셀파일 익스퍼트가 잘 되었습니다');
    } catch (error) {
      console.error(error);
      res.status(500).send('엑셀파일 익스퍼트가 실패하였습니다.');
    }
  });

  
app.listen(process.env.SERVER_PORT, () => console.log(`Server listening on ${process.env.SERVER_PORT}`));
