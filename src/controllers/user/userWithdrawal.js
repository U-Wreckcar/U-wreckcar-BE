import { getAllUtms } from '../../modules/utm.module.js';
import db from '../../../models/index.js';
import { deleteShortUrl } from '../../modules/mongo.module.js';
import { recordWithdrawReason } from '../../modules/mongo.module.js';

export async function userWithdrawal(req, reson, res) {
    try {
        const { user_id } = req.user;
        // const user_id = '108';
        const user_utm = await getAllUtms(user_id);

        const delete_shorten_utm_arr = [];
        user_utm.forEach((index) => {
            delete_shorten_utm_arr.push(index.shorten_url);
        });

        delete_shorten_utm_arr.forEach(async (shorten_url) => {
            try {
                await deleteShortUrl(shorten_url);
                console.log(`${shorten_url} 삭제가 완료되었습니다.`);
            } catch (err) {
                console.error(err);
                return {
                    message: err.message,
                };
            }
        });
        await recordWithdrawReason(reson);
        await db.Users.destroy({ where: { user_id } });

        return res.status(200).json({
            msg: '유저 탈퇴가 완료되었습니다.',
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
