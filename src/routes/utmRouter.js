import express from 'express';
import { asyncWrapper, authenticate } from '../../utils/middleware.js';
import { exportDataToExcel } from '../controllers/utm/exportDataToExcel.js';
import { exportDataToCsv } from '../controllers/utm/exportDataToCsv.js';
import {
    createUtmController,
    deleteUtmController, exportExcelFileController,
    getAllUtmsController,
    getExternalUtmController,
} from '../controllers/utm/utm-crud.js';
import { utmFilters } from '../controllers/utm/utmFilter.js';
import { utmMemo } from '../controllers/utm/utmMemo.js';
import { file_download } from '../controllers/utm/fileDownload.js';
import {exportCSVFileController} from '../controllers/utm/utm-crud.js';

const router = express.Router();

// UTM 데이터 추출 관련
router.get('/api/utms/export/sheet', asyncWrapper(exportDataToCsv));
router.post('/api/utms/export/excell', asyncWrapper(exportDataToExcel));
router.post('/api/utms/filter', asyncWrapper(utmFilters));
router.patch('/api/utms/memo', asyncWrapper(utmMemo));
router.post('/api/utms/export/filedown', asyncWrapper(file_download));
// UTM 관련
router.get('/api/utms', authenticate, asyncWrapper(getAllUtmsController));
// router.delete('/api/utms/:target', authenticate, asyncWrapper(deleteUtmController));
router.post('/api/utms/delete', authenticate, asyncWrapper(deleteUtmController));
router.post('/api/utms', authenticate, asyncWrapper(createUtmController));
router.post('/api/utms/external', authenticate, asyncWrapper(getExternalUtmController));
router.get('/api/utms/tocsv', authenticate, asyncWrapper(exportCSVFileController));
router.get('/api/utms/toexcel', authenticate, asyncWrapper(exportExcelFileController))
router.get('/api/utms/topdf')

export { router };
