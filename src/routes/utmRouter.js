import express from 'express';
import {asyncWrapper, authenticate} from '../../utils/middleware.js';
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
router.get('/api/utms', authenticate, asyncWrapper(getAllUtmsController));
router.delete('/api/utms/:utm_id', authenticate, asyncWrapper(deleteUtmController));
router.post('/api/utms', authenticate, asyncWrapper(createUtmController));
router.post('/api/utms/external', authenticate, asyncWrapper(getExternalUtmController));

// UTM 데이터 추출 관련
router.post('/api/utms/excell', authenticate, asyncWrapper(exportDataToExcel));
router.post('/api/utms/filter', authenticate, asyncWrapper(utmFilters));
router.patch('/api/utms/memo', authenticate, asyncWrapper(utmMemo));

export { router };
