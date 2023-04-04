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
import {
    trackAllUTM,
    trackCreateUTM,
    trackDeleteUTM,
    trackExportCsv,
    trackExportExcel,
    trackExternalUTM,
    trackImportUTM,
    trackUpdateMemo,
    trackUTMFilter,
} from '../../config/mixpanel.config.js';
import { importDataToExcelController } from '../controllers/utm/importDataToExcel.js';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// UTM 데이터 추출 관련
router.post('/api/utms/export/sheet/csv', trackExportCsv, asyncWrapper(exportDataToCsv));
router.post('/api/utms/export/excell', trackExportExcel, asyncWrapper(exportDataToExcel));
router.post('/api/utms/filter', trackUTMFilter, asyncWrapper(utmFilters));
router.patch('/api/utms/memo', trackUpdateMemo, asyncWrapper(utmMemo));
router.post('/api/utms/export/filedown', asyncWrapper(file_download));
router.get('/api/utms/tag/source', asyncWrapper(getUtmSources));
router.get('/api/utms/tag/medium', asyncWrapper(getUtmMediums));
router.post('/api/utms/trialversion', asyncWrapper(TrialversionCreateUtmController));
// UTM 관련
router.get('/api/utms', trackAllUTM, authenticate, asyncWrapper(getAllUtmsController));
router.post('/api/utms/delete', trackDeleteUTM, authenticate, asyncWrapper(deleteUtmController));
router.post('/api/utms', trackCreateUTM, authenticate, asyncWrapper(createUtmController));
router.post(
    '/api/utms/external',
    trackExternalUTM,
    authenticate,
    asyncWrapper(getExternalUtmController)
);
router.post('/api/utms/tocsv', trackExportCsv, authenticate, asyncWrapper(exportCSVFileController));
router.post(
    '/api/utms/toxlsx',
    trackExportExcel,
    authenticate,
    asyncWrapper(exportExcelFileController)
);

// 파일 import 테스트 중
router.post('/api/utms/importdata', upload.any(), trackImportUTM, authenticate, importDataToExcelController);

export { router };
