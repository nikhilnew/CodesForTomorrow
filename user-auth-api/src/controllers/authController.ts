import { Request, Response } from 'express';
import * as authService from '../services/authService';
// import { forgotPassword } from '../services/authService';
// import { resetPassword } from '../services/authService';

export const signup = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const newUser = await authService.signup(firstName, lastName, email, password);
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await authService.forgotPassword(email);
    res.json({ message: 'Reset password email sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  const { password, confirmPassword, resetToken } = req.body;
  try {
    const result = await authService.resetPassword(password, confirmPassword, resetToken);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
