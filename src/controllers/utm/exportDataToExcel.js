import { createConnection } from 'mysql2/promise';
import { utils, writeFile } from 'xlsx';
import config from '../../config/dbconfig.js';
// import { utmFilters } from './utmFilter.js';

async function exportDataToExcel(req) {
    const utm_id_arr = req;

    // db 연결용 config
    const DB_CONFIG = config.test_db_config;

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    const nowTime = year + '-' + month + '-' + date + '-' + hours + minutes + seconds;

    // 파일경로이자 마지막 / 뒤에는 내가 저장하게될 파일 이름 + 확장자 현재경로는 바탕하면으로 할 예정
    // const FILE_PATH = `/Users/User/${file_name} + ${nowTime}.xlsx`;

    const filename = 'UTM_Data_File_Excell ' + nowTime + '.csv';
    const path = `src\\controllers\\utm\\export\\` + `${filename}`;
    // const filename = 'UTM_Data_File_CSV ' + nowTime + '.csv';
    // const outputPath = `src\\controllers\\utm\\export\\` + `${filename}`;

    let sql_id_add = 'WHERE ';
    let id_stack = 1;
    utm_id_arr.forEach((id) => {
        id_stack--;
        if (id_stack < 0) {
            sql_id_add = sql_id_add + 'or ';
        }
        sql_id_add = sql_id_add + `utm_id = '${id}' `;
    });

    const SQL_QUERY = `SELECT source.source_name as '소스ID', medium.medium_name as '미디움ID',utm.utm_url as 'url', utm.utm_campaign_id as '캠페인 ID', utm.utm_campaign_name as '캠페인 이름', utm.utm_term as '캠페인 텀', utm.utm_content as '캠페인 컨텐츠', utm.utm_memo as '메모' FROM uwreckcar_db.Utms as utm inner join User_utm_sources as source inner join User_utm_mediums as medium ${sql_id_add} `;

    const FILE_PATH = `${path}${filename}.xlsx`;
    // const SQL_QUERY = await utmFilters(query);

    // db 연결
    const connection = await createConnection(DB_CONFIG);

    // 쿼리 실행 후 rows 에 담기
    const [rows] = await connection.execute(SQL_QUERY);

    // // 쿼리 실행 후 rows 에 담기
    // const [rows] = await connection.execute(SQL_QUERY);

    // 새로운 파일이랑 워크시트 생성
    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(rows);
    // console.log(worksheet);

    // 워크북에 워크시트 추가
    utils.book_append_sheet(workbook, worksheet);

    // 해당 경로에 워크북 파일 생성
    writeFile(workbook, FILE_PATH);

    // console.log(`파일 내보내기가 잘 실행되었습니다. 파일이 저장된 경로는 -> ${FILE_PATH}`);
    let contentType = '';
    if (filename.endsWith('.xlsx')) {
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    return {
        isSuccess: true,
        msg: 'CSV 파일 내보내기가 잘 실행되었습니다.',
        filename,
        FILE_PATH,
        contentType,
    };

    // return res.status(200).json({
    //     isSuccess: true,
    //     msg: '파일 내보내기가 잘 실행되었습니다.',
    // });
}

export { exportDataToExcel };
