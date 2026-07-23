import express from 'express';
import {
  createInterviewHandler,
  getInterviewsHandler,
  getInterview,
  updateInterviewHandler,
  deleteInterviewHandler,
  submitAnswer,
  completeInterview,
  getDashboardStats,
  getCertificatesHandler,
  getPerformanceData
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createInterviewHandler)
  .get(protect, getInterviewsHandler);

router.get('/dashboard', protect, getDashboardStats);
router.get('/performance', protect, getPerformanceData);
router.get('/certificates', protect, getCertificatesHandler);

router.route('/:id')
  .get(protect, getInterview)
  .put(protect, updateInterviewHandler)
  .delete(protect, deleteInterviewHandler);

router.post('/:id/submit-answer', protect, submitAnswer);
router.post('/:id/complete', protect, completeInterview);

export default router;