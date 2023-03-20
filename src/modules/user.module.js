import db from '../../models/index.js';
import { re } from '@babel/core/lib/vendor/import-meta-resolve.js';

export async function alreadyExists(userData) {
    try {
        const checkDuplicate = await db.Users.findOne({
            where: {
                email: userData.kakao_account.email,
            },
        });

        if (!checkDuplicate) {
            const result = await db.Users.create({
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

export async function findUserData(userData) {
    try {
        const checkUser = await db.Users.findOne({
            where: {
                email: userData.kakao_account.email,
            },
        });
        return checkUser ? checkUser.dataValues : false;
    } catch (err) {
        console.error(err);
        return err;
    }
}
