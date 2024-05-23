import { Router } from 'express';
import { signup, login, forgotPassword, resetPassword,  } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
// router.get('/user', getUserDetails);

export { router as authRouter };
