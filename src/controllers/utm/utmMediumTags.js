import { createConnection } from 'mysql2/promise.js';
import config from '../../config/dbconfig.js';

async function getUtmMediums(req, res) {
    const input = req.user;
    // const input = {
    //     user_id: '3',
    // };
    // console.log(inputMemo);

    const user_id = input['user_id'];
    const DB_CONFIG = config.test_db_config;

    const sql_query = `SELECT medium_name FROM uwreckcar_db.User_utm_mediums where user_id=${user_id} order by created_at desc`;
    console.log(sql_query);
    // db 연결
    const connection = await createConnection(DB_CONFIG);

    const query_result = await connection.execute(sql_query);
    const result = [];
    const data = query_result[0];
    data.forEach(index=> {
        result.push(index.medium_name);
    });

    console.log(result);
    return res.status(200).json({
        isSuccess: true,
        result,
    });
}

export { getUtmMediums };
