import fs from 'fs';
import path from 'path';
import url from 'url';
// import { exportDataToCsv } from './exportDataToCsv';
import { exportDataToCsv } from './exportDataToCsv.js';
const fsPromises = fs.promises;

async function file_download(req, res) {
    // const file_type = req.params;
    // let export_result = '';
    // if (file_type == 'excell') {
    //     export_result = exportDataToCsv(req.body);
    // }

    // const export_result = await exportDataToCsv(req.body);
    // const export_result = await exportDataToCsv(req.body);

    // const filename = export_result['savefilename'];
    // const filepath = export_result['outputPath'];

    const filename = 'UTM_Data_File_CSV_2023-3-19-32949.csv';
    console.log('파일이름', filename);
    console.log('파일이름', filename);
    // const filepath = `../../../export_file/${filename}`;
    // const filepath = `./export/${filename}`;
    const filepath = `src\\controllers\\utm\\export\\${filename}`;

    // const currentFilePath = url.fileURLToPath(import.meta.url);
    // const filepath = path.join(path.dirname(currentFilePath), 'export_file', filename);

    // const filepath = path.join(__dirname, 'export_file', filename);

    console.log('파일의 변조된 이름', filename);
    console.log('파일이 생성된 경로', filepath);
    // const filename = req.body;

    // 파일이 저장된 경로와 이름 찾기
    // const filepath = `../../../export_file/${filename}`;

    //파일 formater 지정
    let contentType = '';
    if (filename.endsWith('.xlsx')) {
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (filename.endsWith('.csv')) {
        contentType = 'text/csv';
    } else if (filename.endsWith('.pdf')) {
        contentType = 'application/pdf';
    } else {
        return res.status(400).send('지원하지 않는 파일 포멧 입니다.');
    }
    console.log(contentType);

    await fsPromises.access(filepath, fs.constants.F_OK);

    // 사용자의 브라우저가 파일을 다운로드하도록 요청하는 데 필요한 헤더 설정
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    const fileStream = fs.createReadStream(filepath);
    console.log('통과???');
    fileStream.pipe(res);

    // setTimeout(() => {
    //     fs.unlink(filepath, (err) => {
    //         if (err) {
    //             console.error(err);
    //             return;
    //         }
    //         console.log(`${filepath} 경로의 파일이 10초 후에 삭제될 예정입니다.`);
    //     });
    // }, 1000); // 24 hours in milliseconds
    // setTimeout(() => {
    //     fs.unlink(filepath, (err) => {
    //         if (err) {
    //             console.error(err);
    //             return;
    //         }
    //         console.log(`${filepath} 경로의 파일이 24시간 후에 삭제될 예정입니다.`);
    //     });
    // }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
}

export { file_download };
