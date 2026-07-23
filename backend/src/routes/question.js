import express from 'express';
import {
  getAllQuestions,
  getSingleQuestion,
  createNewQuestion,
  updateQuestionHandler,
  deleteQuestionHandler,
  getAllCategories,
  createNewCategory,
  getQuestionsByCategory
} from '../controllers/questionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/practice/:category', getQuestionsByCategory);
router.get('/categories', getAllCategories);
router.post('/categories', protect, authorize('admin'), createNewCategory);

router.route('/')
  .get(getAllQuestions)
  .post(protect, authorize('admin'), createNewQuestion);

router.route('/:id')
  .get(getSingleQuestion)
  .put(protect, authorize('admin'), updateQuestionHandler)
  .delete(protect, authorize('admin'), deleteQuestionHandler);

export default router;