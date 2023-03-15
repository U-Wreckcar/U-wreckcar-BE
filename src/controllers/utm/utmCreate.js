// const sql =
// "insert into uwreckcar_db.Utms
// (
// user_id,
// user_utm_source_id,
// user_utm_medium_id,
// utm_campaign,
// utm_content,
// utm_term,
// utm_memo,
// full_url,
// shorten_url)
// values(
// (SELECT user_id FROM uwreckcar_db.Users WHERE user_id='1'),
// (SELECT user_utm_source_id FROM uwreckcar_db.User_utm_sources),
// (SELECT user_utm_medium_id FROM uwreckcar_db.User_utm-_mediums),
// 'naverbs_2023_category_test',
// 'image1',
// 'iphone12',
// 'this메모데스',
// 'https://comic.naver.com/webtoon/detail?titleId=783053&no=72',
// 'https://comic.naver.com/'
// )";

/*
const user_id = '1';
const user_utm_source_id = '2';
const user_utm_medium_id = '2';



const column =
    'user_id,user_utm_source_id,user_utm_medium_id,utm_campaign,utm_content,utm_term,utm_memo,full_url,shorten_url';
let sql_query = `insert into uwreckcar_db.Utms( ${column} ) `;



const value_user_id = `(SELECT user_id FROM uwreckcar_db.Users WHERE user_id='${user_id}'),`;
const value_source_id = `(SELECT ${user_utm_source_id} FROM uwreckcar_db.User_utm_sources),`;
const value_medium_id = `(SELECT ${user_utm_medium_id} FROM uwreckcar_db.User_utm_mediums'),`;

    console.log(sql_query);
*/
