import { createUtm, getAllUtms } from '../../modules/utm.module.js';
import { createConnection } from 'mysql2/promise.js';
import config from '../../config/dbconfig.js';

export async function createUtmController(req, res, next) {
    try {
        const { user_id } = req.user;
        const requirements = ['utm_source', 'utm_medium', 'utm_campaign_name', 'utm_url'];
        const utmsData = req.body.utms;

        // requirements Validation.
        Object.keys(req.body).forEach((key) => {
            if (!req.body[key] && requirements.includes(key)) {
                throw new Error(`Invalid ${key} value.`);
            }
        });

        // map 이 전부 끝날때까지 대기.
        const result = await Promise.all(
            utmsData.map(async (doc) => {
                try {
                    const result = await createUtm(user_id, doc);
                    // 성공 시 생성된 객체의 데이터 return
                    return {
                        utm_id: result.utm_id,
                        full_url: result.full_url,
                        shorten_url: result.shorten_url,
                    };
                } catch (err) {
                    console.error(err);
                    // 실패 시 에러 객체 return
                    return {
                        error: true,
                        message: err.message,
                        stack: err.stack,
                    };
                }
            })
        );

        // 에러 객체 여부 확인 후 존재하면 status 500 으로 response
        const hasError = result.some((item) => item.error);

        if (hasError) {
            res.status(500).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    }
}

export async function deleteUtmController(req, res, next) {
    try {
        // const { target } = req.params;
        // const idArr = target.split('-');
        // const result = await Promise.all(
        //     idArr.map(async (utm_id) => {
        //         try {
        //             const result = await deleteUtm(utm_id);
        //             return result;
        //         } catch (err) {
        //             console.error(err);
        //             return {
        //                 error: true,
        //                 message: err.message,
        //                 stack: err.stack,
        //             };
        //         }
        //     })
        // );
        //
        // const hasError = result.some((item) => item.error);
        //
        // if (hasError) {
        //     res.status(500).json(result);
        // } else {
        //     res.status(200).json(result);
        // }
        const input = req.body['data'] // req 값으로 나오는 배열과 객체값
        const utm_id_arr = [];
        input.forEach(element => {
            utm_id_arr.push(element['utm_id']);   // input 에서 utm_id 만 추출해서 따로 저장
        });

        let sql_id_add = 'WHERE ';
        let id_stack = 1;
        utm_id_arr.forEach((id) => {
            id_stack--;
            if (id_stack < 0) {
                sql_id_add = sql_id_add + 'or ';
            }
            sql_id_add = sql_id_add + `utm_id = ${id} `;
        });

        const sql_query = `DELETE FROM uwreckcar_db.Utms ${sql_id_add}`;
        const DB_CONFIG = config.test_db_config;
        const connection = await createConnection(DB_CONFIG);
        await connection.execute(sql_query);

        res.json({
            msg: "utm_id 삭제성공",
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    }
}

export async function getAllUtmsController(req, res, next) {
    try {
        const { user_id } = req.user;
        const dateFixResult = await getAllUtms(user_id);
        const result = dateFixResult.map((doc) => {
            doc.created_at = new Date(doc.created_at).toISOString().slice(0, 10);
            return doc;
        })
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    }
}

export async function getExternalUtmController(req, res, next) {
    try {
        const { externalUrl, created_at, utm_memo } = req.body;
        let doc = {
            user_id: req.user.user_id,
            created_at,
            utm_memo,
        };

        const [baseUrl, utmResources] = externalUrl.split('?');
        doc['utm_url'] = baseUrl.slice(8);
        const splitResources = utmResources.split('&');

        splitResources.forEach((data) => {
            const [utmType, utmValue] = data.split('=');
            if (utmType == 'utm_campaign') {
                doc['utm_campaign_name'] = utmValue;
            } else if (utmType.includes('utm')) {
                doc[utmType] = utmValue;
            }
        });

        const result = await createUtm(doc);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    }
}
