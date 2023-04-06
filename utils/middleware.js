import axios from 'axios';
import { findUserData } from '../src/modules/user.module.js';
import jwtService from '../src/modules/jwt.module.js';

export async function authenticate(req, res, next) {
    const accessToken = req.headers.authorization;
    const refreshToken = req.headers['x-refresh-token'];

    if (!accessToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // 세션에 사용자 정보가 있는지 확인하고, 있다면 인증을 건너뛰기 - 매 api 요청마다의 인증 생략
    if (req.session.user) {
        req.user = req.session.user;
        return next();
    }

    // uwreckcar 회원가입 유저 authenticate
    const acc_valify = jwtService.validateAccessToken(accessToken.split(' ')[1]);
    const ref_valify = jwtService.validateRefreshToken(refreshToken.split(' ')[1]);
    console.log(acc_valify);

    if (acc_valify) {
        const userData = jwtService.getTokenPayload(accessToken.split(' ')[1]);
        req.user = userData;
        req.session.user = userData;
        return next();
    } else if (ref_valify) {
        const userData = jwtService.getTokenPayload(refreshToken.split(' ')[1]);
        req.user = userData;
        req.session.user = userData;
        const newAccessToken = jwtService.createAccessToken(userData);
        res.cookie('access_token', newAccessToken, { secure: false });
        return next();
    }

    try {
        const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `${accessToken}`,
            },
        });

        // 사용자 정보를 req.user에 저장
        const userData = await findUserData(response.data);
        if (!userData) {
            res.redirect(`${process.env.CLIENT_URL}/login`);
        }
        req.user = userData;
        req.session.user = userData;
        next();
    } catch (error) {
        // 액세스 토큰이 만료되었을 경우
        if (error.response && error.response.status === 401) {
            try {
                // refresh_token을 사용하여 새로운 액세스 토큰을 발급.
                const refreshResponse = await axios.post(
                    'https://kauth.kakao.com/oauth/token',
                    null,
                    {
                        params: {
                            grant_type: 'refresh_token',
                            client_id: process.env.REST_API_KEY,
                            client_secret: process.env.CLIENT_SECRET_KEY,
                            refresh_token: refreshToken,
                        },
                    }
                );

                // 새로 발급받은 액세스 토큰을 쿠키에 저장.
                res.cookie('access_token', refreshResponse.data.access_token, { secure: false });

                // 새로 발급받은 액세스 토큰으로 사용자 정보를 다시 요청.
                const newResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
                    headers: {
                        Authorization: `Bearer ${refreshResponse.data.access_token}`,
                    },
                });

                const userData = await findUserData(newResponse.data);
                if (!userData) {
                    res.redirect(`${process.env.CLIENT_URL}/login`);
                }
                res.cookie();
                req.user = userData;
                req.session.user = userData;
                next();
            } catch (refreshError) {
                // refresh 토큰이 만료되었거나, 잘못된 경우
                if (refreshError.response && refreshError.response.status === 400) {
                    res.status(401).json({ message: 'Invalid refresh token' });
                } else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export function asyncWrapper(asyncFn) {
    return async (req, res, next) => {
        try {
            return await asyncFn(req, res, next);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                isSuccess: false,
                msg: 'Internal Server Error',
            });
        }
    };
}

// export async function authentication(req, res, next) {
//     try {
//         const refreshToken = req.headers['x-refresh-token'];

//         // 세션에 사용자 정보가 있는지 확인하고, 있다면 인증을 건너뛰기 - 매 api 요청마다의 인증 생략
//         if (req.session.user) {
//             req.user = req.session.user;
//             return next();
//         }

//         const [tokenType, tokenValue] = refreshToken.split(' ');

//         if (tokenType !== 'Bearer') {
//             return next(new Error(`Invalid token`));
//         }

//         const { login_type, token } = await jwtService.getTokenPayload(tokenValue);

//         switch (login_type) {
//             case 'kakao':
//                 try {
//                     // refresh_token을 사용하여 새로운 액세스 토큰을 발급.
//                     const refreshResponse = await axios.post(
//                         'https://kauth.kakao.com/oauth/token',
//                         null,
//                         {
//                             params: {
//                                 grant_type: 'refresh_token',
//                                 client_id: process.env.REST_API_KEY,
//                                 client_secret: process.env.CLIENT_SECRET_KEY,
//                                 refresh_token: `${token}`,
//                             },
//                         }
//                     );

//                     // 새로 발급받은 액세스 토큰으로 사용자 정보를 다시 요청.
//                     const newResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
//                         headers: {
//                             Authorization: `Bearer ${refreshResponse.data.access_token}`,
//                         },
//                     });

//                     let userData = await findUserData(newResponse.data);
//                     if (!userData) {
//                         return res.redirect(`${process.env.CLIENT_URL}/login`);
//                     }

//                     req.user = userData;
//                     req.session.user = userData;
//                     return next();
//                 } catch (refreshError) {
//                     // refresh 토큰이 만료되었거나, 잘못된 경우
//                     if (refreshError.response && refreshError.response.status === 400) {
//                         return next();
//                     } else {
//                         return res.status(500).json({ message: 'Internal server error' });
//                     }
//                 }
//             case 'google':
//                 try {
//                     const accessToken = req.headers.authorization;
//                     const refreshToken = req.headers['x-refresh-token'];

//                     // 1. 받아온 액세스 토큰이 유효한지 확인합니다.
//                     const verifyAccessToken = await axios.get(
//                         `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
//                     );

//                     if (verifyAccessToken.data.audience !== process.env.GOOGLE_ID) {
//                         return res
//                             .status(401)
//                             .json({ errorMessage: '잘못된 access token 입니다.' });
//                     }

//                     // 2. 만료일자 체크
//                     const now = Date.now() / 1000; // 현재시간(UTC)
//                     if (now < verifyAccessToken.data.exp) {
//                         return res.json({ accessToken, refreshToken }); // 만료되지 않았으면 기존 액세스 토큰 사용
//                     }

//                     // 3. 만료 되었다면 새로운 엑세스 토큰 요청
//                     const response = await axios.post('https://oauth2.googleapis.com/token', null, {
//                         params: {
//                             client_id: process.env.GOOGLE_ID,
//                             client_secret: process.env.GOOGLE_SECRET,
//                             grant_type: 'refresh_token',
//                             refresh_token: refreshToken,
//                         },
//                     });

//                     const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data;

//                     // 4. 새로운 토큰들을 프론트엔드에 전달
//                     return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
//                 } catch (error) {
//                     console.error(error);
//                     return res
//                         .status(401)
//                         .json({ errorMessage: '유효하지 않은 access token 입니다.' });
//                 }
//             case 'uwreckcar':
//                 try {
//                     const valifyToken = jwtService.validateRefreshToken(token);
//                     if (!valifyToken) {
//                         return next(new Error('Invalid token'));
//                     }

//                     const access_token = jwtService.getTokenPayload(token);
//                     let userData = jwtService.getTokenPayload(access_token);

//                     req.user = userData;
//                     req.session.user = userData;
//                     return next();
//                 } catch (refreshError) {
//                     console.log(refreshError);
//                     return res.status(401).json({ message: refreshError.message });
//                 }
//             default:
//                 return res.status(401).json({
//                     success: false,
//                     message: 'Invalid request.'
//                 });
//         }
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             success: false,
//             msg: 'Internal Server Error',
//         });
//     }
// }
