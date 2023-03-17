import db from '../../models/index.js';

export async function alreadyExists(userData) {
    try {
        const checkDuplicate = await db.Users.findOne({
            where: {
                user_id: userData.id,
            },
        });

        if (!checkDuplicate) {
            const result = await db.Users.create({
                user_id : userData.id,
                username: userData.properties.nickname,
                profile_img: userData.properties.profile_image,
                email: userData.kakao_account.email,
            });
            return result.dataValues;
        } else {
            return checkDuplicate;
        }
    } catch (err) {
        console.error(err);
        return err;
    }
}