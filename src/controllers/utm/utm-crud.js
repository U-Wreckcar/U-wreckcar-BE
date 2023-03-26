import {
    createCSVFile,
    createExcelFile,
    createUtm,
    getAllUtms,
    deleteUtm,
    getCSVUtms,
} from '../../modules/utm.module.js';
import { createConnection } from 'mysql2/promise.js';
import config from '../../config/dbconfig.js';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { getShortUrlClickCount, deleteShortUrl } from '../../modules/mongo.module.js';
const __dirname = path.resolve();

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
        const deleteData = req.body.data;
        const result = await Promise.all(
            deleteData.map(async (utm) => {
                try {
                    const result = await deleteUtm(utm.utm_id);
                    await deleteShortUrl(utm.short_id);
                    return result;
                } catch (err) {
                    console.error(err);
                    return {
                        error: true,
                        message: err.message,
                        stack: err.stack,
                    };
                }
            })
        );

        const hasError = result.some((item) => item.error);

        if (hasError) {
            res.status(500).json(result);
        } else {
            res.status(200).json({
                success: true,
                message: 'deleted successfully.',
            });
        }
        // const input = req.body['data']; // req 값으로 나오는 배열과 객체값
        // const utm_id_arr = [];
        // input.forEach((element) => {
        //     utm_id_arr.push(element['utm_id']); // input 에서 utm_id 만 추출해서 따로 저장
        // });
        //
        // let sql_id_add = 'WHERE ';
        // let id_stack = 1;
        // utm_id_arr.forEach((id) => {
        //     id_stack--;
        //     if (id_stack < 0) {
        //         sql_id_add = sql_id_add + 'or ';
        //     }
        //     sql_id_add = sql_id_add + `utm_id = ${id} `;
        // });
        //
        // const sql_query = `DELETE FROM uwreckcar_db.Utms ${sql_id_add}`;
        // const DB_CONFIG = config.test_db_config;
        // const connection = await createConnection(DB_CONFIG);
        // await connection.execute(sql_query);
        //
        // res.json({
        //     msg: 'utm_id 삭제성공',
        // });
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
        let dateFixResult = await getAllUtms(user_id);
        const result = await Promise.all(
            dateFixResult.map(async (doc) => {
                const click_count = await getShortUrlClickCount(doc.short_id);
                return {
                    utm_id: doc.utm_id,
                    utm_url: doc.utm_url,
                    utm_campaign_id: doc.utm_campaign_id,
                    utm_campaign_name: doc.utm_campaign_name,
                    utm_content: doc.utm_content,
                    utm_term: doc.utm_term,
                    utm_memo: doc.utm_memo,
                    full_url: doc.full_url,
                    shorten_url: doc.shorten_url,
                    click_count,
                    utm_medium_name: doc.utm_medium_name.medium_name,
                    utm_source_name: doc.utm_source_name.source_name,
                    created_at_filter: new Date(doc.created_at).toISOString().slice(0, 10),
                };
            })
        );
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
        const { utm_url, created_at, memo } = req.body;
        let doc = {
            created_at,
            utm_memo: memo,
        };

        const [baseUrl, utmResources] = utm_url.split('?');
        doc['utm_url'] = baseUrl;
        const splitResources = utmResources.split('&');

        splitResources.forEach((data) => {
            const [utmType, utmValue] = data.split('=');
            if (utmType == 'utm_campaign') {
                doc['utm_campaign_name'] = utmValue;
            } else if (utmType.includes('utm')) {
                doc[utmType] = utmValue;
            }
        });

        const result = await createUtm(req.user.user_id, doc);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    }
}

export async function exportCSVFileController(req, res, next) {
    try {
        const { user_id } = req.user;
        const checkDataId = req.body.data;
        const filename = `${user_id}-csv-${new Date(Date.now()).toISOString().slice(0, 10)}`;
        const csvData = await createCSVFile(filename, checkDataId);
        res.set({
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}.csv"`,
        })
            .status(200)
            .send(csvData);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    }
}

export async function exportExcelFileController(req, res, next) {
    try {
        const { user_id } = req.user;
        const checkDataId = req.body.data;
        const filename = `${user_id}-${new Date(Date.now()).toISOString().slice(0, 10)}`;
        await createExcelFile(user_id, filename, checkDataId);
        res.status(200).download(
            __dirname + `/dist/${filename}.xlsx`,
            `${filename}.xlsx`,
            (err) => {
                if (err) throw err;
                fs.unlink(__dirname + `/dist/${filename}.xlsx`, (err) => {
                    if (err) throw err;
                });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    }
}
