/* eslint-disable no-unused-vars */
import { createConnection } from 'mysql2/promise';
import csv from 'fast-csv';
import fs from 'fs';
import path from 'path';
import os from 'os';
import config from '../../config/dbconfig.js';
import contentDisposition from 'content-disposition';
import { file_download } from './fileDownload.js';
const fsPromises = fs.promises;

async function exportDataToCsv(req, res) {
    const db = config.test_db_config;
    const connection = await createConnection(db);

    // const utm_id_arr = req['data']; post로 할때는 이게 맞음
    const utm_id_arr = ['1', '2'];

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    // const hours = today.getHours();
    // const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    const num = today.getTime();
    console.log(num);
    const nowTime = year + '-' + month + '-' + date + '-' + seconds;
    /*
        function deleteAllFilesInFolder(folderPath) {
            fs.readdir(folderPath, (err, files) => {
                if (err) throw err;
    
                for (const file of files) {
                    fs.unlink(path.join(folderPath, file), (err) => {
                        if (err) throw err;
                    });
                }
            });
        }
    
        const deletepath = '/path/to/file.txt';
    
        if (fs.existsSync(deletepath)) {
            console.log(`파일이 있는 경로는 : ${deletepath}`);
            deleteAllFilesInFolder('src\\controllers\\utm\\export');
        } else {
            console.log(`경로상에 파일이 없습니다 : ${deletepath}`);
        }
    */
    // deleteAllFilesInFolder('src\\controllers\\utm\\export');

    const filename = 'UTM_Data_File_CSV.csv';
    // const filepath = `src\\controllers\\utm\\export\\` + `${filename}`;
    const filepath = `src\\controllers\\utm\\export\\${filename}`;
    let sql_id_add = 'WHERE ';
    let id_stack = 1;

    // for (let i = 0; i < utm_id_arr; i++) {
    //     id_stack--;
    //     if (id_stack < 0) {
    //         sql_id_add = sql_id_add + 'or ';
    //     }
    //     const id = utm_id_arr[i];
    //     sql_id_add = sql_id_add + `utm_ud = '${id}' `;
    //     // sql_id_add = sql_id_add + 'id = 1';
    // }
    utm_id_arr.forEach((id) => {
        id_stack--;
        if (id_stack < 0) {
            sql_id_add = sql_id_add + 'or ';
        }
        sql_id_add = sql_id_add + `utm_id = '${id}' `;
    });

    // utm_id_arr.forEach((utm_id_arr) => {
    //     id_stack = id_stack - 1;
    //     if (id_stack < 0) sql_id_add = sql_id_add + 'or ';
    //     sql_id_add = sql_id_add + `utm_id = ${utm_id_arr[]} `;
    // });
    /////////////////////////////////////////////////////////////////////////////

    const path = 'src\\controllers\\utm\\export\\UTM_Data_File_CSV.csv'; // replace with your folder path
    // const filename = 'example.txt'; // replace with your file name

    console.log('딜리트 로직 시작');
    fs.access(path + '/' + filename, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`${filename} does not exist in ${path}`);
            return;
        }

        fs.readdir(path, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path + '/' + file, (err) => {
                    if (err) throw err;
                    console.log(`deleted ${file}`);
                });
            }
        });
    });
    console.log('딜리트 로직 완료')
    /////////

    const query = `SELECT source.source_name as '소스ID', medium.medium_name as '미디움ID',utm.utm_url as 'url', utm.utm_campaign_id as '캠페인 ID', utm.utm_campaign_name as '캠페인 이름', utm.utm_term as '캠페인 텀', utm.utm_content as '캠페인 컨텐츠', utm.utm_memo as '메모' FROM uwreckcar_db.Utms as utm inner join User_utm_sources as source inner join User_utm_mediums as medium ${sql_id_add} group by utm.utm_id`;

    const [rows] = await connection.execute(query);

    const csvStream = csv.format({ headers: true, encoding: 'utf8mb4' });

    csvStream.pipe(fs.createWriteStream(filepath, { encoding: 'utf8' })).on('finish', () => {
        console.log('CSV 파일이 잘 완성되었습니다람쥐.');
    });
    rows.forEach((row) => {
        csvStream.write(row);
    });

    // csvStream.end();

    // 추출하기 추가

    //파일 formater 지정
    let contentType = '';
    if (filename.endsWith('.xlsx')) {
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (filename.endsWith('.csv')) {
        contentType = 'text/csv';
    } else if (filename.endsWith('.pdf')) {
        contentType = 'application/pdf';
    } else {
        return res.status(400).send('지원하지 않는 파일 포멧 입니다.');
    }
    // console.log(contentType);

    // await fsPromises.access(filepath, fs.constants.F_OK);
    console.log('이제 헤더만 뚫으면 된다 제바라ㅏ라라라ㄹㄹㄹㄹㄹㄹ');
    // 사용자의 브라우저가 파일을 다운로드하도록 요청하는 데 필요한 헤더 설정
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    // console.log('여기까지는 오나?')

    const last_path = 'src\\controllers\\utm\\export\\UTM_Data_File_CSV.csv';
    // const last_path =
    //     'src\\controllers\\utm\\export\\UTM_Data_File_CSV1679213462400.csv';
    // const last_path =
    // 'src\\controllers\\utm\\export\\UTM_Data_File_CSV1679214799647.csv';
    // const last_path = `src\\controllers\\utm\\export\\`;
    // const last_path = path.join('src', 'controllers', 'utm', 'export', filename);

    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    // const last_path = path.join(__dirname, 'controllers', 'utm', 'export', filename);
    // const last_paht2 = 'src\\controllers\\utm\\export\\' + filename;

    // const fileStream = fs.createReadStream(filepath);
    // const delete_path = `src\\controllers\\utm\\export\\${filename}`;
    const delete_path = 'src\\controllers\\utm/export\\' + filename;
    console.log('스트림 패스', delete_path);
    // const raw_path = String.raw`${stream_path}`;
    // console.log('여기는 변환이 된 패스', raw_path);
    // const fileStream = fs.createReadStream(last_path); // 이게 현재까지는 최종 실행파일

    // const str = filepath.replace(/'/, /`/);

    // const stream_path = 'src\\controllers\\utm\\export\\UTM_Data_File_CSV1679224162610.csv';
    const fileStream = fs.createReadStream(last_path);

    // const stream = fs.createReadStream(last_path, { encoding: 'utf-8', highWaterMark: 64 });

    // stream.on('data', (chunk) => {
    //     console.log(`Received ${chunk.length} characters of data.`);
    // });

    // stream.on('end', () => {
    //     console.log('Finished reading file.');
    // });

    // stream.on('error', (err) => {
    //     console.error(`Error reading file: ${err}`);
    // });

    // const fileStream = fs.createReadStream(delete_path);

    // fileStream.on('error', (err) => {
    //     console.error('파일을 읽으면서 에러가 발생하였습니다 :', err);
    // });

    // stream.pipe(res);
    await fileStream.pipe(res);
}

export { exportDataToCsv };
