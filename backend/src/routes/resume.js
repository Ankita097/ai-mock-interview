import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  analyzeResume,
  getResumeReports,
  getResumeReport,
  deleteResumeReport
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/analyze', protect, upload.single('resume'), analyzeResume);
router.get('/reports', protect, getResumeReports);
router.route('/reports/:id')
  .get(protect, getResumeReport)
  .delete(protect, deleteResumeReport);

export default router;