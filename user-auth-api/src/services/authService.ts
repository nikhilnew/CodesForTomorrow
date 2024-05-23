import bcrypt from 'bcrypt';
import User from '../models/user';
import { generateToken } from '../utils/generateToken';
import { sendResetPasswordEmail } from './emailService';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export const signup = async (firstName: string, lastName: string, email: string, password: string) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email is already in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ firstName, lastName, email, password: hashedPassword });
  return newUser;
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }
  const token = generateToken(user.id);
  return token;
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }
  const resetToken = generateToken(user.id);
  // Send email with reset password link
  await sendResetPasswordEmail(user.email, resetToken);
};

export const resetPassword = async (password: string, confirmPassword: string, resetToken: string) => {
  // Verify the reset token
  const decodedToken = jwt.verify(resetToken, config.jwtSecret) as { id: number };
  if (!decodedToken) {
    throw new Error('Invalid or expired reset token');
  }

  const { id } = decodedToken;

  // Find the user in the database
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }

  // Update the user's password
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  user.password = password;
  await user.save();

  return { message: 'Password reset successful' };
};
