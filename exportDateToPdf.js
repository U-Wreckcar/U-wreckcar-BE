// const mysql = require('mysql');
// const fs = require('fs');
// const xlsx = require('xlsx');

// // db 연결용 config
// const DB_CONFIG = {
//   host: '127.0.0.1',
//   user: 'kshpr',
//   password: 'root',
//   database: 'kshexportdb',
// };

// const FILE_PATH = `/Users/User/성현pdf`;

// async function exportDataToPDF() {
//   try {

//     // 원하는 데이터대로 쿼리사용후 데이터 조회
//     const myData = await DB_CONFIG.query('SELECT * FROM member')

//     // pdf 파일 생성
//     const doc = new PDFDocument();

//     // doc 에 텍스트를 추가하기위한 반복문
//     myData.forEach((row) => {
//       doc.text(`${row.id}: ${row.name}`);
//     });

//     // 해당경로에 doc 파일 (pdf) 를 저장 할것이다.
//     doc.pipe(fs.createWriteStream(FILE_PATH));
//     doc.end();

//   } catch {
//     console.error(error);
//   }

// }

// module.exports = exportDataToPDF;
