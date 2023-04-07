/* eslint-disable no-unused-vars */
import { createConnection } from 'mysql2/promise';
import csv from 'fast-csv';
import fs from 'fs';
import path from 'path';
import os from 'os';
import config from '../../config/dbconfig.js';
const __dirname = path.resolve();

async function exportDataToCsv(req, res) {
    const db = config.test_db_config;
    const connection = await createConnection(db);
    const input = req.body;

    const utm_id_arr = [];
    input.forEach((index) => {
        const utm_id = index['utm_id'];
        utm_id_arr.push(utm_id);
    });

    let sql_id_add = 'WHERE ';
    let id_stack = 1;
    utm_id_arr.forEach((id) => {
        id_stack--;
        if (id_stack < 0) {
            sql_id_add = sql_id_add + 'or ';
        }
        sql_id_add = sql_id_add + `utm.utm_id = '${id}' `;
    });
    const sql_query = `SELECT  DATE_FORMAT(utm.created_at, '%Y-%m-%d') as created_at, utm.utm_url as URL ,utm.utm_campaign_id as 캠페인ID,utm.utm_url, source.source_name as 소스, medium.medium_name as 미디움, utm.utm_campaign_name as 캠페인이름, utm.utm_term as 캠페인_텀, utm.utm_content as 캠페인콘텐츠, utm.full_url as full_url, utm.shorten_url as Shorten_URL, utm.utm_memo as utm_memo FROM uwreckcar_db.Utms as utm LEFT join User_utm_sources as source on utm.user_utm_source_id = source.user_utm_source_id JOIN User_utm_mediums as medium on utm.user_utm_medium_id = medium.user_utm_medium_id ${sql_id_add} group by utm.utm_id `;

    const filename = 'UTM_Data_File_CSV';
    const filepath = path.join(__dirname, 'export', 'UTM_Data_File_CSV');
    const [rows] = await connection.execute(sql_query);

    const csvStream = csv.format({ headers: true, encoding: 'utf8mb4' });
    csvStream.pipe(fs.createWriteStream(filepath, { encoding: 'utf8' })).on('finish', () => {
        console.log('CSV 파일이 잘 완성되었습니다.');
        res.set({
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename=${filename}.csv`,
        }).sendFile(filepath);
    });

    rows.forEach((row) => {
        csvStream.write(row);
    });
    csvStream.end();

    // mysql 연결해제
    connection.end();
}

export { exportDataToCsv };
