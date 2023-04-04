import db from '../../models/index.js';
import { re } from '@babel/core/lib/vendor/import-meta-resolve.js';
import crypto from 'crypto';
import Slack from '../../config/slackbot.config.js';

export async function alreadyExists(userData) {
    try {
        const checkDuplicate = await db.Users.findOne({
            where: {
                email: userData.kakao_account.email,
            },
        });

        if (!checkDuplicate) {
            // const result = await db.Users.create({
            //     username: userData.properties.nickname,
            //     profile_img: userData.properties.profile_image,
            //     email: userData.kakao_account.email,
            //     password: '-',
            //     salt: '-',
            //     company_name: '-',
            //     marketing_accept: true,
            //     login_type: 'kakao',
            // });
            // return result.dataValues;
            return false;
        } else {
            return checkDuplicate;
        }
    } catch (err) {
        console.error(
            `====================user.module.js/alreadyExists Error.=============================`
        );
        await Slack('alreadyExists', err);
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
        console.error(
            `====================user.module.js/findUserData Error.=============================`
        );
        await Slack('findUserData', err);
        return err;
    }
}

export async function createCompanyUser(
    username,
    email,
    password,
    salt,
    company_name,
    marketing_accept
) {
    try {
        const dupCheck = await db.Users.findOne({ where: { email } });
        if (dupCheck) {
            return false;
        } else {
            const result = await db.Users.create({
                username,
                profile_img:
                    'https://velog.velcdn.com/images/tastekim_/post/60f96a34-2142-43fe-b109-9312af658a3d/image.png',
                email,
                password,
                salt,
                company_name,
                marketing_accept,
                login_type: 'uwreckcar',
            });
            return result.dataValues;
        }
    } catch (err) {
        console.error(
            `====================user.module.js/createCompanyUser Error.=============================`
        );
        await Slack('createCompanyUser', err);
        return err;
    }
}

export async function findCompanyUserData(email) {
    try {
        const checkUser = await db.Users.findOne({ where: { email } });
        return checkUser ? checkUser.dataValues : false;
    } catch (err) {
        console.error(
            `====================user.module.js/findCompanyUserData Error.=============================`
        );
        await Slack('findCompanyUserData', err);
        return err;
    }
}

export async function createSalt() {
    try {
        const salt = await crypto.randomBytes(64);
        return salt.toString('base64');
    } catch (err) {
        console.log(
            `====================user.module.js/createSalt Error.=============================`
        );
        await Slack('createSalt', err);
        if (err instanceof Error) {
            return err;
        }
    }
}

export const createHashedPassword = (plainPassword) =>
    new Promise(async (resolve, reject) => {
        const salt = await createSalt();
        if (!salt || salt instanceof Error) {
            reject(new Error('failed to create salt'));
        } else {
            crypto.pbkdf2(plainPassword, salt, 999, 64, 'sha512', (err, key) => {
                if (err) reject(err);
                resolve({ password: key.toString('base64'), salt });
            });
        }
    });

export const getHashedPassword = (plainPassword, salt) =>
    new Promise(async (resolve, reject) => {
        crypto.pbkdf2(plainPassword, salt, 999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve({ password: key.toString('base64'), salt });
        });
    });

export async function setNewPassword(email, password, salt) {
    try {
        await db.Users.update({ password: password, salt: salt }, { where: { email } });
        return true;
    } catch (err) {
        console.error(err);
        await Slack('setNewPassword', err);
        return false;
    }
}

// export async function makePasswordHashed(email, plainPassword) {
//     try {
//         const hashed = await createHashedPassword(plainPassword);
//         return hashed;
//     } catch (err) {
//         console.error(
//             `====================user.moudule.js/makePasswordHashed Error.=============================`
//         );
//         if (err instanceof Error) {
//             return err;
//         }
//     }
// }
