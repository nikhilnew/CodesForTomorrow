import { Router } from 'express';
import { signup, login, getUserDetails, forgotPassword, resetPassword } from '../controllers/authControllers';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/user', authenticate, getUserDetails);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
