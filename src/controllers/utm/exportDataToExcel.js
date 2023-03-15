import { createConnection } from 'mysql2/promise';
import { utils, writeFile } from 'xlsx';
import config from '../../config/dbconfig.js';

async function exportDataToExcel(req, res) {
    try {
        // db 연결용 config
        const DB_CONFIG = config.test_db_config;

        // 앞으로 많이 수정하게 될 쿼리문
        const SQL_QUERY = 'SELECT * FROM member';

        const today = new Date();
        const year = today.getFullYear(); // 년도
        const month = today.getMonth() + 1; // 월
        const date = today.getDate(); // 날짜
        const hours = today.getHours(); // 시
        const minutes = today.getMinutes(); // 분
        const seconds = today.getSeconds(); // 초
        const nowTime =
            year + '-' + month + '-' + date + ' ' + hours + '-' + minutes + '-' + seconds;
        const file_name = '김성현의 테스트 엑셀파일 데이터';

        // 파일경로이자 마지막 / 뒤에는 내가 저장하게될 파일 이름 + 확장자 현재경로는 바탕하면으로 할 예정
        const FILE_PATH = `/Users/User/${file_name} + ${nowTime}.xlsx`;

        // db 연결
        const connection = await createConnection(DB_CONFIG);

        // 쿼리 실행 후 rows 에 담기
        const [rows] = await connection.execute(SQL_QUERY);

        // 새로운 파일이랑 워크시트 생성
        const workbook = utils.book_new();
        const worksheet = utils.json_to_sheet(rows);
        // console.log(worksheet);

        // 워크북에 워크시트 추가
        utils.book_append_sheet(workbook, worksheet);

        // 해당 경로에 워크북 파일 생성
        writeFile(workbook, FILE_PATH);

        // console.log(`파일 내보내기가 잘 실행되었습니다. 파일이 저장된 경로는 -> ${FILE_PATH}`);

        return res.status(200).json({
            isSuccess: true,
            msg: '파일 내보내기가 잘 실행되었습니다.',
            path: '파일이 생성된 위치는 ' + FILE_PATH + ' 입니다.',
        });
    } catch (error) {
        return res.status(400)({
            msg: '유효하지 않은 값입니다. 에러내용을 확인해주세요',
            error,
        });
    }
}

export { exportDataToExcel };
