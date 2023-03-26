import jwtService from '../../modules/jwt.module.js';
import { createCompanyUser } from '../../modules/user.module.js';
import transporter from '../../config/nodemailer.config.js';
import { nanoid } from 'nanoid';

export async function signupForCompanyController(req, res, next) {
    try {
        const userData = await createCompanyUser(req.body['data']);
        console.log(req.body['data']);
        if (!userData) {
            res.status(400).json({
                success: false,
                message: `Already signed up for ${req.body.email}`,
            });
        } else {
            const access_token = jwtService.createAccessToken(userData);
            const refresh_token = jwtService.createRefreshToken(userData);

            res.status(200).send({ userData, access_token, refresh_token });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

export async function sendEmailController(req, res, next) {
    try {
        const { email } = req.body.data;
        const verificationCode = nanoid(6);
        const mailOptions = {
            from: `${process.env.NODEMAILER_ACCOUNT}@naver.com`,
            to: email,
            subject: 'U렉카 회원가입 인증 안내 입니다.',
            text: `인증 코드는 ${verificationCode} 입니다.`,
        };
        const result = await transporter.sendMail(mailOptions, (err, res) => {
            if (err) {
                console.log(err);
                throw new Error(err.message);
            } else {
                console.log('send mail success');
                return true;
            }
        });

        res.status(200).json({
            verificationCode,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}
