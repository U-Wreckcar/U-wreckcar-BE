import axios from 'axios';
import passport from 'passport';

export async function auth(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(400).json({
            isSuccess: false,
            msg: '토큰 정보가 없습니다.',
        });
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

// export async function authenticateUsers(req, res, next) {
//     try {
//         if (!req.headers.authorization) {
//             return res.status(401).json({ message: 'Not authenticated' });
//         }
//
//         const token = req.headers.authorization;
//         console.log(token);
//
//         const result = await axios.get('https://kapi.kakao.com/v2/user/me', {
//             headers: {
//                 Authorization: `${token}`,
//             },
//         });
//         if (result.data.err) {
//             return next(result.data.err);
//         }
//
//         req.user = result.data;
//         next();
//     } catch (err) {
//         console.error(err.response.data);
//         res.status(err.response.status || 500).send({
//             message: err.message,
//         });
//     }
// }

export const authPassport = passport.authenticate('kakao', {
    successRedirect: `${process.env.CLIENT_URL}`,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
});
