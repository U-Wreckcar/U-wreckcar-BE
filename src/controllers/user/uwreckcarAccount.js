import jwtService from '../../modules/jwt.module.js';
import {
    createCompanyUser,
    createHashedPassword,
    findCompanyUserData,
    getHashedPassword,
    setNewPassword,
} from '../../modules/user.module.js';
import transporter from '../../config/nodemailer.config.js';
import { nanoid } from 'nanoid';
import redisClient from '../../config/redis.config.js';
import Slack from '../../../config/slackbot.config.js';
import { verifyAccountToEmail, verifyPasswordToEmail } from '../../modules/nodemailer.module.js';

// uwreckcar 회원가입
export async function signupForCompanyController(req, res, next) {
    try {
        const { email, password, company_name, marketing_accept, username } = req.body.data;

        const hashPassword = await createHashedPassword(password);
        const userData = await createCompanyUser(
            username,
            email,
            hashPassword.password,
            hashPassword.salt,
            company_name,
            marketing_accept
        );
        if (!userData) {
            res.status(400).json({
                success: false,
                message: `Already signed up for ${email}`,
            });
        } else {
            res.status(200).json({
                user_id: userData.user_id,
                username: userData.username,
                email: userData.email,
                profile_img: userData.profile_img,
                company_name: userData.company_name,
                marketing_accept: userData.marketing_accept,
            });
        }
    } catch (err) {
        console.error(err);
        await Slack('signupForCompanyController', err);
        res.status(500).json({ message: err.message });
    }
}

// 회원가입 인증 코드 이메일 보내기
export async function sendEmailController(req, res, next) {
    try {
        const { email } = req.body.data;
        const dupCheck = await findCompanyUserData(email);
        if (dupCheck !== false) {
            return res.status(403).json({
                success: false,
                message: 'Email already exists.',
            });
        }

        const verificationCode = nanoid(6);
        await redisClient.set(`${email}`, verificationCode);
        await redisClient.expire(`${email}`, 3 * 60);
        const sendEmailResult = await verifyAccountToEmail(email, verificationCode);

        return sendEmailResult
            ? res.status(200).json({
                  success: true,
                  message: 'Send mail successfully.',
              })
            : res.status(500).json({
                  success: false,
                  message: 'Failed to send mail.',
              });
    } catch (err) {
        console.error(err);
        await Slack('sendEmailController', err);
        res.status(500).json({ message: err.message });
    }
}

// 인증 코드 검증하기
export async function validateEmailController(req, res, next) {
    try {
        const { email, verificationCode } = req.body.data;
        const verificationCode_fact = await redisClient.get(`${email}`);
        console.log('email : ', email);
        console.log('fact : ', verificationCode_fact);
        console.log('user : ', verificationCode);

        if (verificationCode_fact === verificationCode) {
            res.status(200).json({
                success: true,
                message: 'Email verified',
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Email verified failed.',
            });
        }
    } catch (err) {
        console.error(err);
        await Slack('validateEmailController', err);
        res.status(500).json({ message: err.message });
    }
}

// uwreckcar 회원 로그인
export async function signinForCompanyController(req, res, next) {
    try {
        const { email, password } = req.body.data;
        const userData = await findCompanyUserData(email);

        if (userData !== false) {
            const inputPassword = await getHashedPassword(password, userData.salt);
            if (userData.password === inputPassword.password) {
                const access_token = jwtService.createAccessToken(userData);
                const refresh_token = jwtService.createRefreshToken(userData);
                res.status(200).json({
                    userData: {
                        user_id: userData.user_id,
                        username: userData.username,
                        email: userData.email,
                        profile_img: userData.profile_img,
                        company_name: userData.company_name,
                        marketing_accept: userData.marketing_accept,
                    },
                    access_token,
                    refresh_token,
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: `Invalid password.`,
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: `Couldn't find user ${email}`,
            });
        }
    } catch (err) {
        console.error(err);
        await Slack('signinForCompanyController', err);
        res.status(500).json({ message: err.message });
    }
}

// 비밀번호 재설정을 위한 인증메일 보내기
export async function verifyMissingPasswordToEmailController(req, res, next) {
    try {
        const { email } = req.body.data;
        const dupCheck = await findCompanyUserData(email);
        if (dupCheck === false) {
            return res.status(403).json({
                success: false,
                message: 'Email is not exists',
            });
        }
        const verificationCode = nanoid(6);
        await redisClient.set(`${email}`, verificationCode);
        await redisClient.expire(`${email}`, 3 * 60);

        const sendEmailResult = await verifyPasswordToEmail(email, verificationCode);
        return sendEmailResult
            ? res.status(200).json({
                  success: true,
                  message: 'Send mail successfully.',
              })
            : res.status(500).json({
                  success: false,
                  message: 'Failed to send mail.',
              });
    } catch (err) {
        console.error(err);
        await Slack('verifyMissingPasswordToEmailController', err);
        res.status(500).json({ message: err.message });
    }
}

// 비밀번호 재설정하기
export async function setNewPasswordController(req, res, next) {
    try {
        const { email, password } = req.body.data;
        const hashPassword = await createHashedPassword(password);
        const setPasswordResult = await setNewPassword(
            email,
            hashPassword.password,
            hashPassword.salt
        );

        return setPasswordResult
            ? res.status(200).json({
                  success: true,
                  message: 'Set New Password Successfully.',
              })
            : res.status(500).json({
                  success: false,
                  message: 'Failed Set New Password.',
              });
    } catch (err) {
        console.error(err);
        await Slack('setNewPasswordController', err);
        res.status(500).json({ message: err.message });
    }
}
