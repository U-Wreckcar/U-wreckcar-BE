import express from 'express';
import { asyncWrapper } from '../../utils/middleware.js';
import { exportDataToExcel } from '../controllers/utm/exportDataToExcel.js';
import {
    createUtmController,
    deleteUtmController,
    getAllUtmsController,
    getExternalUtmController,
} from '../controllers/utm/utm-crud.js';
import { utmFilters } from '../controllers/utm/utmFilter.js';
import { utmMemo } from '../controllers/utm/utmMemo.js';

const router = express.Router();

// UTM 관련
router.get('/api/utms', asyncWrapper(getAllUtmsController));
router.delete('/api/utms/:utm_id', asyncWrapper(deleteUtmController));
router.post('/api/utms', asyncWrapper(createUtmController));
router.post('/api/utms/external', asyncWrapper(getExternalUtmController));

// UTM 데이터 추출 관련
router.post('/api/utms/excell', asyncWrapper(exportDataToExcel));
router.post('/api/utms/filter', asyncWrapper(utmFilters));
router.patch('/api/utms/memo', asyncWrapper(utmMemo));

export { router };
