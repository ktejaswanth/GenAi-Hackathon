import express from 'express';
import { getHealthDashboard } from '../controllers/diaryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getHealthDashboard);

export default router;