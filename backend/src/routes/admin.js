import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  suspendUser,
  unsuspendUser,
  getAllCompanies,
  createCompany,
  deleteCompany,
  getAnalytics
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/analytics', getAnalytics);

router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

router.post('/users/:id/suspend', suspendUser);
router.post('/users/:id/unsuspend', unsuspendUser);

router.route('/companies')
  .get(getAllCompanies)
  .post(createCompany);

router.delete('/companies/:id', deleteCompany);

export default router;