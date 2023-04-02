import express from 'express';
import { asyncWrapper, authenticate } from '../../utils/middleware.js';
import { exportDataToExcel } from '../controllers/utm/exportDataToExcel.js';
import { exportDataToCsv } from '../controllers/utm/exportDataToCsv.js';
import {
    createUtmController,
    deleteUtmController,
    exportExcelFileController,
    getAllUtmsController,
    getExternalUtmController,
} from '../controllers/utm/utm-crud.js';
import { utmFilters } from '../controllers/utm/utmFilter.js';
import { utmMemo } from '../controllers/utm/utmMemo.js';
import { file_download } from '../controllers/utm/fileDownload.js';
import { exportCSVFileController } from '../controllers/utm/utm-crud.js';
import multer from 'multer';
import xlsx from 'xlsx';
import { getUtmSources } from '../controllers/utm/utmSourceTags.js';
import { getUtmMediums } from '../controllers/utm/utmMediumTags.js';
import { TrialversionCreateUtmController } from '../controllers/utm/utm-crud.js';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// UTM 데이터 추출 관련
router.get('/api/utms/export/sheet/csv', asyncWrapper(exportDataToCsv));
router.post('/api/utms/export/excell', asyncWrapper(exportDataToExcel));
router.post('/api/utms/filter', asyncWrapper(utmFilters));
router.patch('/api/utms/memo', asyncWrapper(utmMemo));
router.post('/api/utms/export/filedown', asyncWrapper(file_download));
router.get('/api/utms/tag/source', asyncWrapper(getUtmSources));
router.get('/api/utms/tag/medium', asyncWrapper(getUtmMediums));
router.post('/api/utms/trialversion', asyncWrapper(TrialversionCreateUtmController));
// UTM 관련
router.get('/api/utms', authenticate, asyncWrapper(getAllUtmsController));
router.post('/api/utms/delete', authenticate, asyncWrapper(deleteUtmController));
router.post('/api/utms', authenticate, asyncWrapper(createUtmController));
router.post('/api/utms/external', authenticate, asyncWrapper(getExternalUtmController));
router.post('/api/utms/tocsv', authenticate, asyncWrapper(exportCSVFileController));
router.post('/api/utms/toxlsx', authenticate, asyncWrapper(exportExcelFileController));

// 파일 import 테스트 중
router.post('/test', upload.any(), async (req, res) => {
    const data = req.files[0];
    console.log(req.files[0].filename); // 이걸로 데이터 저장 후 서버에 남지 않게 다시 삭제할 때 찾아서 쓰면될듯, 아니면 filepath 하면 경로랑 이름 붙어서 다나옴
    function parseExcel(file) {
        const workbook = xlsx.readFile(file.path);
        const sheet_name_list = workbook.SheetNames;
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        return data;
    }

    const parseData = parseExcel(data);
    console.log(parseData)
    // 내용
    // 쇼튼 없으면 주어진 utm 링크로 만들어주기? 각 칼럼명이 지정한 칼럼명으로 변경되었는지 확인? 그 외 없는 칼럼은 버리도록?
});

export { router };
