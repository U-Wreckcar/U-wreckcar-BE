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
import { async } from 'regenerator-runtime';
const fsPromises = fs.promises;
const __dirname = path.resolve();

async function exportDataToCsv(req, res) {
    const db = config.test_db_config;
    const connection = await createConnection(db);

    const input = req.body;

    console.log(input);
    // const input = [
    //     {
    //         utm_id: 1588,
    //         utm_url: 'naver.com/',
    //         utm_campaign_id: 'blog',
    //         utm_campaign_name: 'blogproject',
    //     },
    //     {
    //         utm_id: 1589,
    //         utm_url: 'daum.com',
    //         utm_campaign_id: 'dfdfsd',
    //         utm_campaign_name: 'fsdsf',
    //     },
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

    const filename = 'UTM_Data_File_CSV';
    const filepath = path.join(__dirname, 'export', 'UTM_Data_File_CSV');
    const [rows] = await connection.execute(sql_query);
    // console.log('여기는 로우스 입니달ㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹ', [rows]);

    const csvStream = csv.format({ headers: true, encoding: 'utf8mb4' });
    csvStream.pipe(fs.createWriteStream(filepath, { encoding: 'utf8' })).on('finish', () => {
        console.log('CSV 파일이 잘 완성되었습니다.');
    });

    rows.forEach((row) => {
        csvStream.write(row);
    });
    // mysql 연결취소
    connection.end();

    //----------------------

    res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=${filename}.csv`,
    })
        // .csvStream(csvStream)
        .status(200)
        .sendFile(filepath);
    // .unlink(filepath, (err) => {
    //     if (err) {
    //         console.log('파일삭제 에러 : ', err);
    //     } else {
    //         console.log(`파일경로 : ${filepath} 의 파일이 무사히 삭제되었습니다.`);
    //     }
    // });
}

export { exportDataToCsv };
