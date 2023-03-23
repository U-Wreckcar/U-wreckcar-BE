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

async function exportDataToCsv(req, res) {
    try {
        console.log(11111111);
        const db = config.test_db_config;
        const connection = await createConnection(db);

        const input = req.body;
        console.log(input);

        let sql_id_add = 'WHERE ';
        let id_stack = 1;
        input.forEach((id) => {
            id_stack--;
            if (id_stack < 0) {
                sql_id_add = sql_id_add + 'or ';
            }
            sql_id_add = sql_id_add + `utm.utm_id = '${id}' `;
        });
        console.log('sql 아이디 웨얼문 ㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹ', sql_id_add);
        const sql_query = `SELECT  DATE_FORMAT(utm.created_at, '%Y-%m-%d') as 생성일자, utm.utm_url as URL ,utm.utm_campaign_id as 캠페인ID,utm.utm_url, source.source_name as 소스, medium.medium_name as 미디움, utm.utm_campaign_name as 캠페인이름, utm.utm_term as 캠페인_텀, utm.utm_content as 캠페인콘텐츠, utm.full_url as UTM, utm.shorten_url as Shorten_URL, utm.utm_memo as 메모 FROM uwreckcar_db.Utms as utm LEFT join User_utm_sources as source on utm.user_utm_source_id = source.user_utm_source_id JOIN User_utm_mediums as medium on utm.user_utm_medium_id = medium.user_utm_medium_id ${sql_id_add} group by utm.utm_id `;

        // const query3 = query;
        const filename = 'UTM_Data_File_CSV.csv';
        const filepath = `src\\controllers\\utm\\export\\${filename}`;
        // const filepath = `src\\controllers\\utm\\export\\${filename}`;

        const test1 = 'SELECT * FROM uwreckcar_db.Utms';
        const test2 = 'SELECT * FROM uwreckcar_db.Utms where utm_id=143';
        //-------------------

        // create a connection to your MySQL databas

        // your SQL query

        // run the query
        // const query2 = 'SELECT * FROM uwreckcar_db.Utms';
        const [rows] = await connection.execute(sql_query);
        // console.log('여기는 로우스 입니달ㄹㄹㄹㄹㄹㄹㄹㄹㄹㄹ', [rows]);

        const csvStream = csv.format({ headers: true, encoding: 'utf8mb4' });

        csvStream.pipe(fs.createWriteStream(filepath, { encoding: 'utf8' })).on('finish', () => {
            console.log('CSV 파일이 잘 완성되었습니다.');
        });

        rows.forEach((row) => {
            csvStream.write(row);
        });
        // close the MySQL connection
        connection.end();
        //----------------------
        console.log(22222222);
        // // 추출하기 추가
    } catch (err) {
        console.log(err);
        console.log(33333333);
    } finally {
        console.log(4444444);
        const filename = 'UTM_Data_File_CSV.csv';
        const filepath = `src\\controllers\\utm\\export\\${filename}`;
        //파일 formater 지정
        let contentType = 'text/csv';
        console.log(contentType);


        fs.stat(filepath, (err, stat) => {
            if (err) {
                console.error(err);
                return;
            }
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            // res.setHeader('Content-Transfer-Encoding', 'binary');
            // res.setHeader('Cache-Control', 'public, max-age=0');
            // res.setHeader('Expires', '-1');
            // res.setHeader('Pragma', 'public');
            // res.setHeader('Content-Length', stat.size);
            // res.setHeader('compress', false);
            console.log('여기는 파일스트림 직전');
            const fileStream = fs.createReadStream(filepath);
            if (fileStream) {
                fileStream.pipe(res);
            }
            fileStream.on('close', () => {
                console.log('File stream closed');
            });
            fileStream.on('error', (err) => {
                console.log(`File stream error: ${err}`);
            });
        });
    }
}
// 파일 세팅

// exportDataToCsv.then()

export { exportDataToCsv };
