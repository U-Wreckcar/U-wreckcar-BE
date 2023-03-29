import jwtService from '../../modules/jwt.module.js';
import {
    createCompanyUser,
    createHashedPassword,
    findCompanyUserData,
    getHashedPassword,
} from '../../modules/user.module.js';
import transporter from '../../config/nodemailer.config.js';
import { nanoid } from 'nanoid';

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
        res.status(500).json({ message: err.message });
    }
}

export async function sendEmailController(req, res, next) {
    try {
        const { email } = req.body.data;
        const dupCheck = await findCompanyUserData(email);
        if (dupCheck !== false) {
            res.status(403).json({
                success: false,
                message: 'Email already exists.',
            });
        } else {
            const verificationCode = nanoid(6);

            const mailOptions = {
                from: `${process.env.NODEMAILER_ACCOUNT}@naver.com`,
                to: email,
                subject: 'U렉카 회원가입 인증 안내 입니다.',
                html: `
            <!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Welcome to our mailing list!</title>
    <style>
        /* CSS reset */
        body, h1, h2, h3, h4, h5, h6, p, ol, ul {
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f1f1f1;
        }

        h1, h2, h3, h4, h5, h6 {
            font-weight: normal;
            margin-bottom: 0.5rem;
            color: #222;
        }

        p {
            margin-bottom: 1rem;
            color: #444;
            font-size: 18px;
            line-height: 1.4;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .image-container {
            text-align: center;
            margin-bottom: 1rem;
        }

        .image-container img {
            max-width: 100%;
            height: auto;
        }

        .button {
            display: inline-block;
            background-color: #0070c0;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 1rem;
        }

        .button:hover {
            background-color: #005499;
        }

        .footer {
            margin-top: 2rem;
            text-align: center;
            color: #888;
        }

        .footer a {
            color: #888;
        }

        .footer a:hover {
            color: #444;
        }
    </style>
</head>

<body>
<div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    <div class="image-container" style="text-align: center; margin-bottom: 1rem;">
        <img src="https://velog.velcdn.com/images/tastekim_/post/035ebb31-ff86-495e-a7a6-65ba041e9318/image.jpg" alt="Service Image" style="max-width: 100%; height: auto;">
    </div>
    <h1 style="font-weight: normal; margin-bottom: 0.5rem; color: #222;">유렉카 서비스를 이용해주셔서 감사합니다!</h1>
    <p style="margin-bottom: 1rem; color: #444; font-size: 18px; line-height: 1.4;">${
        email.split('@')[0]
    } 님,</p>
    <p style="margin-bottom: 1rem; color: #444; font-size: 18px; line-height: 1.4;">아래 인증 코드를 가지고 이메일 인증을 완료해주세요.</p>
     <p style="margin-bottom: 1rem; color: #444; font-size: 18px; line-height: 1.4;">* 한 번 사용된 메일은 재사용 할 수 없습니다. 인증을 받으신 후 메일을 삭제해주세요.</p>
    <p style="margin-bottom: 1rem; color: #444; font-size: 18px; line-height: 1.4;">인증 코드 : ${verificationCode}</p>
    <a href="https://utm.works" class="button" style="display: inline-block; background-color: #0070c0; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 1rem;">Explore our website</a>
    <p class="footer" style="margin-top: 2rem; text-align: center; color: #888;">Best regards,<br>Team 유렉카<br> © 2023 유렉카 All rights reserved.</p>
</div>
</body>
</html>
`,
            };

            await transporter.sendMail(mailOptions, (err, res) => {
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
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

export async function signinForCompanyController(req, res, next) {
    try {
        const { email, password } = req.body.data;
        const userData = await findCompanyUserData(email);

        if (userData !== false) {
            res.status(404).json({
                success: false,
                message: `Couldn't find user ${email}`,
            });
        } else {
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
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}
