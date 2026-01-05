import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { inviteEmployee, addAdmin } from '../controllers/company.controller';

const router = express.Router();

router.use(protect); // All routes require login

router.post('/invite', authorize('company', 'super_admin', 'user'), inviteEmployee); // Allow 'user' too if they are admin-in-company (need check in controller, doing it now)
router.post('/add-admin', authorize('company', 'super_admin'), addAdmin);

export default router;
