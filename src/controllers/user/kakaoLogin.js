import axios from 'axios';

export function redirectURI(req, res) {
    // 사용자를 카카오 로그인 페이지로 리디렉션
    // REDIRECT_URI=프론트 주소 , 카카오에서 응답 받으면 다시 서버주소의 '/auth/kakao/callback'으로 요청해야 함.
    res.redirect(
        `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code`
    )
}

export async function kakaoAuth(req, res) {
    try {
        // 엑세스 토큰 받아오기
        const tokenResponse = await axios.post(
            'https://kauth.kakao.com/oauth/token',
            {
                grant_type: 'authorization_code',
                client_id: process.env.REST_API_KEY,
                client_secret: process.env.CLIENT_SECRET_KEY,
                redirect_uri: process.env.REDIRECT_URI,
                code: req.query.code,
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        console.log('3')

        // 받은 엑세스토큰으로 유저 정보 가져오기
        const profileResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${tokenResponse.data.access_token}`,
            },
        });

        // profileResponse.data 에 있는 유저 정보로 회원 정보 확인 후 새로운 유저 및 기존 유저 판별 로직 필요

        console.log(profileResponse.data);

        // 로그인 후 메인페이지
        res.redirect('/');
    } catch (error) {
        console.error(error);
        // 프론트에서의 로그인 전 메인페이지
        res.redirect('/login');
    }
}


// app.get('/auth/kakao', (req, res) => {
//     // 사용자를 카카오 로그인 페이지로 리디렉션
//     res.redirect(
//         `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code`
//     );
// });

// app.get('/auth/kakao/callback', async (req, res) => {
//     try {
//         // 액세스 토큰에 대한 교환 승인 코드
//         // Exchange authorization code for access token
//         const tokenResponse = await axios.post(
//             'https://kauth.kakao.com/oauth/token',
//             {
//                 grant_type: 'authorization_code',
//                 client_id: process.env.REST_API_KEY,
//                 client_secret: process.env.CLIENT_SECRET_KEY,
//                 redirect_uri: process.env.REDIRECT_URI,
//                 code: req.query.code,
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//             }
//         );
//
//         // Use access token to get user profile information
//         const profileResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
//             headers: {
//                 Authorization: `Bearer ${tokenResponse.data.access_token}`,
//             },
//         });
//
//         // Handle user authentication and create a session
//         // User profile information is available in the 'profileResponse.data' object
//         console.log(profileResponse);
//         res.redirect('/');
//     } catch (error) {
//         // Handle error
//         console.error(error);
//         res.redirect('/login');
//     }
// });