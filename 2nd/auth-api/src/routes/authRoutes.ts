import { Router } from 'express';
import { getUserDetails, forgotPassword, resetPassword } from '../controllers/authControllers';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/user', authenticate, getUserDetails);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
