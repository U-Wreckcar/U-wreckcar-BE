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
    const data = req.body;

    // const data = [
    //     {
    //         utm_id: 13,
    //         utm_url: 'naver.com/',
    //         utm_campaign_id: 'blog',
    //         utm_campaign_name: 'blogproject',
    //     },
    //     { utm_id: 16, utm_url: 'daum.com', utm_campaign_id: 'dfdfsd', utm_campaign_name: 'fsdsf' },
    // ];
    const utm_id_arr = [];
    data.forEach((index) => {
        const utm_id = index['utm_id'];
        utm_id_arr.push(utm_id);
    });
    console.log(utm_id_arr);

    console.log(data[0]);
    //파일 삭제 로직 생성
    function deleteAllFilesInFolder(folderPath) {
        fs.readdir(folderPath, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(folderPath, file), (err) => {
                    if (err) throw err;
                });
            }
        });

        // 해당경로에 파일이 있다면 전부 삭제
        const delete_path = 'src\\controllers\\utm\\export\\UTM_Data_File_CSV.csv';
        if (fs.existsSync(delete_path)) {
            console.log(`파일이 있는 경로는 : ${delete_path}`);
            deleteAllFilesInFolder('src\\controllers\\utm\\export');
        } else {
            console.log(`경로상에 파일이 없습니다 : ${delete_path}`);
        }
    }
    // console.log('sql_id_add 에 뭐가 들어가는지 확인해보자');
    let sql_id_add = 'WHERE ';
    let id_stack = 1;
    utm_id_arr.forEach((id) => {
        id_stack--;
        if (id_stack < 0) {
            sql_id_add = sql_id_add + 'or ';
        }
        sql_id_add = sql_id_add + `utm.utm_id = '${id}' `;
    });

    // const query = `SELECT source.source_name as '소스ID', medium.medium_name as '미디움ID',utm.utm_url as 'url', utm.utm_campaign_id as '캠페인 ID', utm.utm_campaign_name as '캠페인 이름', utm.utm_term as '캠페인 텀', utm.utm_content as '캠페인 컨텐츠', utm.utm_memo as '메모' FROM uwreckcar_db.Utms as utm inner join User_utm_sources as source inner join User_utm_mediums as medium ${sql_id_add} group by utm.utm_id`;

    const query = `SELECT utm.utm_url as URL,utm.utm_campaign_id as 캠페인ID, source.source_name as 소스, medium.medium_name as 미디움, utm_campaign_name as 캠페인이름, utm.utm_term as 캠페인텀, utm.utm_content as 콘텐츠, utm.full_url as UTM, utm.shorten_url Shorten_URL, utm.utm_memo as 메모 FROM uwreckcar_db.Utms as utm inner join User_utm_sources as source inner join User_utm_mediums as medium ${sql_id_add} group by utm.utm_id`;

    // db 연결 및 SQL query 문 실행 결과 rows 에 담기
    const db = config.test_db_config;
    const connection = await createConnection(db);
    const [rows] = await connection.execute(query);

    const filename = 'UTM_Data_File_CSV.csv';
    const filepath = `src\\controllers\\utm\\export\\${filename}`;

    // csv 파일 생성
    const csvStream = csv.format({ headers: true, encoding: 'utf8mb4' });
    csvStream.pipe(fs.createWriteStream(filepath, { encoding: 'utf8' })).on('finish', () => {
        console.log('CSV 파일이 생성완료.');
    });

    // 파일에 쿼리 실행 결과값 담기
    rows.forEach((row) => {
        csvStream.write(row);
    });
    console.log('csv 파일에 내용 담기 완료');

    csvStream.end();

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

    console.log('헤더 시작', contentType);
    // 사용자의 브라우저가 파일을 다운로드하도록 요청하는 데 필요한 헤더 설정
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    // console.log('여기까지는 오나?')

    const last_path = 'src\\controllers\\utm\\export\\UTM_Data_File_CSV.csv';

    console.log('파일을 내보내기 위한 스트림 시작');

    const stream = fs.createReadStream(last_path, { encoding: 'utf-8', highWaterMark: 64 });
    stream.on('data', (chunk) => {
        console.log(`Received ${chunk.length} characters of data.`);
    });

    stream.on('end', () => {
        console.log('Finished reading file.');
    });

    stream.on('error', (err) => {
        console.error(`Error reading file: ${err}`);
    });

    // fileStream.on('error', (err) => {
    //     console.error('파일을 읽으면서 에러가 발생하였습니다 :', err);
    // });
    console.log('파일을 내보내기 위한 스트림이 잘 마무리됨');

    // stream.pipe(res);
    await stream.pipe(res);
    console.log('파이프까지 완료');
}

export { exportDataToCsv };
