import express from 'express';
import { generateStudyPlan, generateRelaxationText, generateGameSuggestion } from '../controllers/genaiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/study-plan', protect, generateStudyPlan);
router.get('/relaxation-text', protect, generateRelaxationText);
router.get('/game-suggestion', protect, generateGameSuggestion);

export default router;