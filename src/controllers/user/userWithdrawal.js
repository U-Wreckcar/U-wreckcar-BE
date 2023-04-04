import { getAllUtms } from '../../modules/utm.module.js';
import db from '../../../models/index.js';
import { deleteShortUrl } from '../../modules/mongo.module.js';
import { recordWithdrawReason } from '../../modules/mongo.module.js';
import Slack from '../../../config/slackbot.config.js';

export async function userWithdrawal(req, res, next) {
    try {
        const { user_id } = req.user;
        const { reason } = req.body.data;
        // const user_id = '108';
        const user_utm = await getAllUtms(user_id);

        const delete_shorten_utm_arr = user_utm.map((index) => index.shorten_url);

        const deleteResult = delete_shorten_utm_arr.map(async (shorten_url) => {
            const result = await deleteShortUrl(shorten_url);
            console.log(`${shorten_url} 삭제가 완료되었습니다.`);
            return result;
        });
        await recordWithdrawReason(reason);
        await db.Users.destroy({ where: { user_id } });
        if (deleteResult.includes(false)) {
            res.status(200).json({
                success: true,
                message: `Success but few shorten url is left.`,
            });
        } else {
            res.status(200).json({
                msg: '유저 탈퇴가 완료되었습니다.',
            });
        }
    } catch (err) {
        console.error(err);
        await Slack('userWithdrawal', err);
        res.status(500).json({ message: err.message });
    }
}
