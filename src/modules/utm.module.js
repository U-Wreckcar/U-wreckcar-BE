import db from '../../models/index.js';
import Shortener from 'link-shortener';

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
            created_at
        } = inputVal;

        let full_url = `https://${utm_url}?utm_source=${utm_source}&utm_medium=${utm_medium}&utm_campaign=${utm_campaign_name}`;

        if (utm_term) {
            full_url += `&utm_term=${utm_term}`;
        } else if (utm_content) {
            full_url += `&utm_content=${utm_content}`;
        }

        const shorten_url = await Shortener.Shorten(full_url);

        const utmData = await db.Utms.create({
            utm_url,
            utm_campaign_id,
            utm_campaign_name,
            utm_content,
            utm_memo,
            utm_term,
            user_utm_medium_id,
            user_utm_source_id,
            user_id,
            full_url,
            shorten_url,
            created_at,
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
        return result
            ? { status: 200, success: true, message: 'delete success.' }
            : { status: 404, success: false, message: 'invalid utm_id.' };
    } catch (err) {
        console.error(err);
        return err;
    }
}

// UTM 전체 조회
export async function getAllUtms(user_id) {
    try {
        const result = await db.Utms.findAll({ where: { user_id } });
        return result;
    } catch (err) {
        console.error(err);
        return err;
    }
}
