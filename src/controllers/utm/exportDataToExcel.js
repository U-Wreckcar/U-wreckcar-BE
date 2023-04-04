import { createConnection } from 'mysql2/promise';
import { utils, writeFile } from 'xlsx';
import config from '../../config/dbconfig.js';
import path from 'path';
const __dirname = path.resolve();
// import { utmFilters } from './utmFilter.js';

async function exportDataToExcel(req, res) {
    // db 연결
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

    const filename = 'UTM_Data_File_Excell';
    const filepath = path.join(__dirname, 'export', 'UTM_Data_File_Excell');

    // 쿼리 실행 후 rows 에 담기
    const [rows] = await connection.execute(sql_query);

    // 새로운 파일이랑 워크시트 생성
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(rows);

    // 워크북에 워크시트 추가
    utils.book_append_sheet(workbook, worksheet);

    // 해당 경로에 워크북 파일 생성
    writeFile(workbook, filepath);
    connection.end();

    res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=${filename}.xlsx`,
    })
        .status(200)
        .sendFile(filepath);
}

export { exportDataToExcel };
