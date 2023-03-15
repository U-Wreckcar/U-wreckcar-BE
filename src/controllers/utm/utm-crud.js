import { createUtmData } from '../../modules/sequelize.js';
export async function createUtm(req, res, next) {
    try {
        const username = 'test';
        const {
            user_id,
            utm_url,
            utm_campaign,
            utm_campaign_name,
            utm_source,
            utm_medium,
            utm_term,
            utm_content,
            utm_memo,
        } = req.body;

        await createUtmData(user_id, utm_source, utm_medium);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    }
}
