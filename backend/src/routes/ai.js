import express from 'express';
import {
  generateQuestions,
  evaluateAnswer,
  generateFeedback,
  getRecommendations,
  executeCode
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-questions', protect, generateQuestions);
router.post('/evaluate-answer', protect, evaluateAnswer);
router.post('/generate-feedback', protect, generateFeedback);
router.post('/recommendations', protect, getRecommendations);
router.post('/execute-code', protect, executeCode);

export default router;