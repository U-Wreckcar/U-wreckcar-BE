import xlsx from 'xlsx';
import { createUtm } from '../../modules/utm.module.js';
import { awrap } from 'regenerator-runtime';
import Slack from '../../../config/slackbot.config.js';
import fs from 'fs';

export async function importDataToExcelController(req, res, next) {
    try {
        const data = req.files[0];
        const filepath = `uploads/${req.files[0].filename}`;

        function parseExcel(file) {
            const workbook = xlsx.readFile(file.path);
            const sheet_name_list = workbook.SheetNames;
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            return data;
        }

        let parseData = parseExcel(data);

        // 빈값으로 줄 때
        for (let i = 0; i < parseData.length; i++) {
            if (parseData[i].created_at === undefined) {
                parseData[i].created_at = new Date(Date.now()).toISOString().slice(0, 10);
            }
            if (parseData[i].utm_memo === undefined) {
                parseData[i].utm_memo = '-';
            }
        }

        // 템플릿 유효한지 확인
        for (let i = 0; i < parseData.length; i++) {
            if (
                !(
                    Object.keys(parseData[i]).includes('full_url') &&
                    Object.keys(parseData[i]).includes('utm_memo') &&
                    Object.keys(parseData[i]).includes('created_at')
                )
            )
                throw new Error(`invalid key "${Object.keys(parseData[i])}"`);
        }

        const dateRegexp = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
        const urlRegexp = /^https:\/\//;

        // 입력값 유효한지 확인
        for (let i = 0; i < parseData.length; i++) {
            if (!dateRegexp.test(parseData[i].created_at))
                throw new Error(`invalid date value "${parseData[i].created_at}"`);
            if (!urlRegexp.test(parseData[i].full_url))
                throw new Error(`invalid value "${parseData[i].full_url}"`);
        }

        const processDataForDB = Promise.all(
            parseData.map(async (doc) => {
                try {
                    const [baseUrl, utmResources] = doc.full_url.split('?');
                    const splitResources = utmResources.split('&');

                    const newDoc = {
                        utm_url: baseUrl,
                        utm_memo: doc.utm_memo,
                        created_at: doc.created_at,
                    };

                    splitResources.forEach((data) => {
                        try {
                            const [utmType, utmValue] = data.split('=');
                            if (utmType == 'utm_campaign') {
                                newDoc['utm_campaign_name'] = utmValue;
                            } else if (utmType.includes('utm')) {
                                newDoc[utmType] = utmValue;
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    });
                    return newDoc;
                } catch (err) {
                    console.error(err);
                    return false;
                }
            })
        );
        const pendingProcessDataForDB = await processDataForDB;

        const pendingResult = Promise.all(
            pendingProcessDataForDB.map(async (doc) => {
                const result = await createUtm(req.user.user_id, doc);
                return result.message
                    ? {
                          error: true,
                          message: `url : ${doc.utm_url}, source: ${doc.utm_source}, medium : ${doc.utm_medium}, campaign : ${doc.utm_campaign_name}`,
                      }
                    : { error: false, message: `${doc.utm_url}` };
            })
        );

        const result = await pendingResult;

        const hasError = result.some((item) => item.error);

        if (hasError) {
            fs.unlink(filepath, (err) =>
                err ? console.log(err) : console.log(`${filepath} 를 정상적으로 삭제했습니다`)
            );
            res.status(400).json({
                success: false,
                message: 'few data failed.',
                result});
        } else {
            fs.unlink(filepath, (err) =>
                err ? console.log(err) : console.log(`${filepath} 를 정상적으로 삭제했습니다`)
            );
            res.status(200).json({
                success: true,
                message: 'Import data successfully.',
            });
        }
    } catch (err) {
        console.error(err);
        await Slack('importDataToExcelController', err);
        res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    }
}
