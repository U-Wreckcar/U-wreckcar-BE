import { createUtm, deleteUtm, getAllUtms } from '../../modules/utm.module.js';

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

        const result = await Promise.all(utmsData.map(async (doc) => {
            try {
                const result = await createUtm(user_id, doc);
                return {
                    utm_id: result.utm_id,
                    full_url: result.full_url,
                    shorten_url: result.shorten_url
                };
            } catch (err) {
                console.error(err);
                return {
                    error: true,
                    message: err.message,
                    stack: err.stack,
                };
            }
        }));

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
        const { utm_id } = req.params;
        const result = await deleteUtm(utm_id);
        res.status(result.status).json(result);
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
        const result = await getAllUtms(user_id);
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
    } catch (err) {}
}
