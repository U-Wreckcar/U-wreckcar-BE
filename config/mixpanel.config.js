import Mixpanel from 'mixpanel'

const mixpanel = Mixpanel.init(`${process.env.MIXPANEL_API}`)

export function trackApiRequests(req, res, next) {
    try {
        const requestData = {
            path: req.path,
            method: req.method,
            user_agent: req.headers['user-agent'],
            ip: req.ip,
            body: req.body,
        };

        mixpanel.track('API Request', requestData);

        next();
    } catch (err) {
        console.error(err);
        next();
    }
}