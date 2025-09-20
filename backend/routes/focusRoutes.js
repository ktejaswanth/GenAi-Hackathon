import express from 'express';
import { getRelaxationExercise } from '../controllers/focusController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/exercise', protect, getRelaxationExercise);

export default router;