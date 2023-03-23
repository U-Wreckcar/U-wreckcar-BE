/* eslint-disable no-unused-vars */
import { createConnection } from 'mysql2/promise';
import mysql from 'mysql2/promise';
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

    const input = req.body;
    console.log(input);
    // const input= [
    //     {
    //         utm_id: 69,
    //         utm_url: 'naver.com/',
    //         utm_campaign_id: 'blog',
    //         utm_campaign_name: 'blogproject',
    //     },
    //     { utm_id: 143, utm_url: 'daum.com', utm_campaign_id: 'dfdfsd', utm_campaign_name: 'fsdsf' },
    // ];

    const utm_id_arr = [];
    input.forEach((index) => {
        const utm_id = index['utm_id'];
        utm_id_arr.push(utm_id);
    });
    console.log(utm_id_arr);

    let sql_id_add = 'WHERE ';
    let id_stack = 1;
    utm_id_arr.forEach((id) => {
        id_stack--;
        if (id_stack < 0) {
            sql_id_add = sql_id_add + 'or ';
        }
        sql_id_add = sql_id_add + `utm.utm_id = '${id}' `;
    });
    const sql_query = `SELECT  DATE_FORMAT(utm.created_at, '%Y-%m-%d') as 생성일자, utm.utm_url as URL ,utm.utm_campaign_id as 캠페인ID,utm.utm_url, source.source_name as 소스, medium.medium_name as 미디움, utm.utm_campaign_name as 캠페인이름, utm.utm_term as 캠페인_텀, utm.utm_content as 캠페인콘텐츠, utm.full_url as UTM, utm.shorten_url as Shorten_URL, utm.utm_memo as 메모 FROM uwreckcar_db.Utms as utm LEFT join User_utm_sources as source on utm.user_utm_source_id = source.user_utm_source_id JOIN User_utm_mediums as medium on utm.user_utm_medium_id = medium.user_utm_medium_id ${sql_id_add} group by utm.utm_id `;
    console.log('실행될 쿼리문', sql_query);

    // 파일경로 설정
    const filename = 'UTM_Data_File_CSV.csv';
    const filepath = `src\\controllers\\utm\\export\\${filename}`;

    // 쿼리 실행문 rows 에 담은 후 csv 파일 생성후 입력
    const [rows] = await connection.execute(sql_query);

    const csvStream = csv.format({ headers: true, encoding: 'utf8mb4' });
    csvStream.pipe(fs.createWriteStream(filepath, { encoding: 'utf8' })).on('finish', () => {
        console.log('CSV 파일이 잘 완성되었습니다.');
    });
    rows.forEach((row) => {
        csvStream.write(row);
    });

    // 커넥션 종료
    connection.end();

    // 추출하기 로직
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
    console.log(contentType);

    // 사용자의 브라우저가 파일을 다운로드하도록 요청하는 데 필요한 헤더 설정
    // 파일 추출후 읽을 수 있는 상태로 추출하기를 할 수 있도록 포멧터 설정
    // 파일 세팅
    fs.stat(filepath, (err, stat) => {
        if (err) {
            console.error(err);
            return;
        }
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Transfer-Encoding', 'binary');
        res.setHeader('Cache-Control', 'public, max-age=0');
        res.setHeader('Expires', '-1');
        res.setHeader('Pragma', 'public');
        res.setHeader('Content-Length', stat.size);
        res.setHeader('compress', false);

        // 파일읽은후 내보내기 최종
        const fileStream = fs.createReadStream(filepath);
        fileStream.pipe(res);
        fileStream.on('close', () => {
            console.log('File stream closed');
        });
        fileStream.on('error', (err) => {
            console.log(`File stream error: ${err}`);
        });
    });
}

export { exportDataToCsv };
