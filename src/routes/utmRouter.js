import express from 'express';
import { asyncWrapper } from '../../utils/middleware.js';
import {exportDataToExcel} from '../controllers/utm/exportDataToExcel.js';


const router = express.Router();

// UTM 관련
router.get('/api/utm', () => { });
router.get('/api/utm', () => { });
router.delete('/api/utm', () => { });
router.post('/api/utm', () => { });
router.post('/api/utm', () => { });
router.post('/api/utm', () => { });
router.post('/api/utm', () => { });
router.post('/api/utm', () => { });

// UTM 데이터 추출 관련
router.get('/export/excell', asyncWrapper(exportDataToExcel));


export { router };
