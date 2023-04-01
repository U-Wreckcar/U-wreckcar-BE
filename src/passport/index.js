// import { serializeUser, deserializeUser } from 'passport';
// // import local from './localStrategy'; // 로컬서버로 로그인할때
// import google from './googleStrategy'; // 구글서버로 로그인할때
// import Users from '../../models/users';
// export default () => {
//     serializeUser((user, done) => {
//         done(null, user.id);
//     });
//
//     deserializeUser((id, done) => {
//         Users.findOne({ where: { id } })
//             .then((Users) => done(null, Users))
//             .catch((err) => done(err));
//     });
//     google(); // 구글 전략 등록
// };
