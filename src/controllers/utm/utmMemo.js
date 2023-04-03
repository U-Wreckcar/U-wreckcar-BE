import { createConnection } from 'mysql2/promise.js';
import config from '../../config/dbconfig.js';

async function utmMemo(req, res) {
    const inputMemo = req.body;
    // const inputMemo = {
    //     id: '6',
    //     memo: ' "수정할 메모의 내용을 입력" ',
    // };
    console.log(inputMemo);

    const utm_id = inputMemo['utm_id'];
    const utm_memo = inputMemo['utm_memo'];
    const DB_CONFIG = config.test_db_config;

    const sql_query = `UPDATE uwreckcar_db.Utms SET utm_memo = '${utm_memo}' where utm_id=${utm_id} ; `;
    // db 연결
    const connection = await createConnection(DB_CONFIG);

    await connection.execute(sql_query);
    connection.end();

    return res.status(200).json({
        isSuccess: true,
        msg: '메모 수정이 완료되었습니다',
        update_utm_id: inputMemo['utm_id'],
    });
}

export { utmMemo };
