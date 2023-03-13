import express from 'express';
import { asyncWrapper } from '../../utils/middleware.js';
import { exportDataToExcel } from '../controllers/utm/exportDataToExcel.js';
import { utmFilters } from '../controllers/utm/utmFilter.js';
import { utmMemo } from '../controllers/utm/utmMemo.js';
const router = express.Router();

// UTM 관련
router.get('/api/utm', () => {});
router.get('/api/utm', () => {});
router.delete('/api/utm', () => {});
router.post('/api/utm', () => {});
router.post('/api/utm', () => {});
router.post('/api/utm', () => {});
router.post('/api/utm', () => {});
router.post('/api/utm', () => {});

// UTM 데이터 추출 관련
router.post('/api/utms/excell', asyncWrapper(exportDataToExcel));
router.post('/api/utms/filter', asyncWrapper(utmFilters));
router.patch('/api/utm/memo', asyncWrapper(utmMemo));

export { router };
