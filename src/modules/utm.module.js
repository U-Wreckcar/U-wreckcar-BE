import db from '../../models/index.js';
import axios from 'axios';
import { nanoid } from 'nanoid';
import Papa from 'papaparse';
import xlsx from 'json-as-xlsx';
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();

// User_utm_source 생성
export async function createUtmSources(user_id, utm_source) {
    try {
        const checkDuplicate = await db.User_utm_sources.findOne({
            where: {
                source_name: utm_source,
            },
        });

        if (!checkDuplicate) {
            const result = await db.User_utm_sources.create({
                user_id: user_id,
                source_name: utm_source,
            });
            return result.dataValues.user_utm_source_id;
        } else {
            return checkDuplicate.dataValues.user_utm_source_id;
        }
    } catch (err) {
        console.error(err);
        return err;
    }
}

// User_utm_medium 생성
export async function createUtmMediums(user_id, utm_medium) {
    try {
        const checkDuplicate = await db.User_utm_mediums.findOne({
            where: {
                medium_name: utm_medium,
            },
        });

        if (!checkDuplicate) {
            const result = await db.User_utm_mediums.create({
                user_id: user_id,
                medium_name: utm_medium,
            });
            return result.dataValues.user_utm_medium_id;
        } else {
            return checkDuplicate.dataValues.user_utm_medium_id;
        }
    } catch (err) {
        console.error(err);
        return err;
    }
}

// UTM data 생성
export async function createUtm(user_id, inputVal) {
    try {
        const user_utm_source_id = await createUtmSources(user_id, inputVal.utm_source);
        const user_utm_medium_id = await createUtmMediums(user_id, inputVal.utm_medium);

        const {
            utm_url,
            utm_campaign_id,
            utm_campaign_name,
            utm_source,
            utm_medium,
            utm_term,
            utm_content,
            utm_memo,
            created_at,
        } = inputVal;

        // crated_at 에 입력한 날짜가 없으면 오늘 날짜로 YYYY-MM-DD 로 변환
        // const dateOnly = new Date(created_at || Date.now()).toISOString().slice(0, 10);

        let full_url = `${utm_url}?utm_source=${utm_source}&utm_medium=${utm_medium}&utm_campaign=${utm_campaign_name}`;

        if (utm_term) {
            full_url += `&utm_term=${utm_term}`;
        } else if (utm_content) {
            full_url += `&utm_content=${utm_content}`;
        }

        // const shorten_url = await cuttly.shortenUrl(process.env.CUTTLY_KEY, full_url);

        const axiosResponse = await axios.post('https://li.urcurly.site/rd', {
            full_url,
            id: nanoid(10),
        });
        const shorten_url = axiosResponse.data?.shortUrl;
        if (shorten_url === undefined) {
            throw new Error('Could not make shortUrl.');
        }

        const utmData = await db.Utms.create({
            utm_url,
            utm_campaign_id: utm_campaign_id || '-',
            utm_campaign_name,
            utm_content: utm_content || '-',
            utm_memo: utm_memo || '-',
            utm_term: utm_term || '-',
            user_utm_medium_id,
            user_utm_source_id,
            user_id,
            full_url,
            shorten_url: shorten_url || '-',
            created_at: created_at || Date.now(),
        });

        return utmData.toJSON();
    } catch (err) {
        console.error(err);
        return err;
    }
}

// UTM 삭제.
export async function deleteUtm(utm_id) {
    try {
        const result = await db.Utms.destroy({ where: { utm_id } });
        return result ? { success: true } : { success: false, message: 'invalid utm_id.' };
    } catch (err) {
        console.error(err);
        return err;
    }
}

// UTM 전체 조회
export async function getAllUtms(user_id) {
    try {
        const result = await db.Utms.findAll(
            {
                where: { user_id },
                include: [
                    {
                        model: db.User_utm_mediums,
                        as: 'utm_medium_name',
                        attributes: ['medium_name'],
                    },
                    {
                        model: db.User_utm_sources,
                        as: 'utm_source_name',
                        attributes: ['source_name'],
                    },
                ],
            },
            { order: [['created_at', 'desc']] }
        );
        return result;
    } catch (err) {
        console.error(err);
        return err;
    }
}

// UTM CSV 용 전체 조회
export async function getCSVUtms(user_id) {
    try {
        const result = await db.Utms.findAll(
            {
                where: { user_id },
                include: [
                    {
                        model: db.User_utm_mediums,
                        as: 'utm_medium_name',
                        attributes: ['medium_name'],
                    },
                    {
                        model: db.User_utm_sources,
                        as: 'utm_source_name',
                        attributes: ['source_name'],
                    },
                ],
            },
            { order: [['created_at', 'desc']] }
        );
        return result;
    } catch (err) {
        console.error(err);
        return err;
    }
}

export async function createCSVFile(filename, data) {
    try {
        const csv = Papa.unparse(data);
        fs.writeFile(__dirname + `/dist/${filename}.csv`, csv, (err) => {
            if (err) throw err;
        });
    } catch (err) {
        console.error(err);
        return err;
    }
}

export async function createExcelFile(user_id, filename, data) {
    try {
        let sheetData = [
            {
                sheet: 'MyUTM',
                columns: [
                    { label: 'UTM_url', value: 'utm_url' },
                    { label: 'UTM_campaign_id', value: 'utm_campaign_id' },
                    { label: 'UTM_campaign_name', value: 'utm_campaign_name' },
                    { label: 'UTM_medium', value: 'utm_medium_name' },
                    { label: 'UTM_source', value: 'utm_source_name' },
                    { label: 'UTM_content', value: 'utm_content' },
                    { label: 'UTM_term', value: 'utm_term' },
                    { label: 'UTM_memo', value: 'utm_memo' },
                    { label: 'UTM_full_url', value: 'full_url' },
                    { label: 'UTM_shorten_url', value: 'shorten_url' },
                    { label: 'UTM_created_at', value: 'created_at_filter' },
                ],
                content: data,
            },
        ];
        let settings = {
            fileName: `./dist/${filename}`,
            extraLength: 11, // A bigger number means that columns will be wider
            writeMode: 'writeFile', // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
            writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
            RTL: false, // Display the columns from right-to-left (the default value is false)
        };
        xlsx(sheetData, settings, (sheet) => {
            console.log(`./dist/${filename}.xlsx file created.`);
        });
    } catch (err) {
        console.error(err);
        return err;
    }
}
