import Slack from '../../../config/slackbot.config.js';

export async function getUserProfile(req, res, next) {
    try {
        const { user_id, username, email, profile_img, company_name } = req.user;
        res.status(200).json({
            user_id,
            username,
            email,
            profile_img,
            company_name,
        });
    } catch (err) {
        console.error(err);
        await Slack('getUserProfile', err)
        return next(err);
    }
}
