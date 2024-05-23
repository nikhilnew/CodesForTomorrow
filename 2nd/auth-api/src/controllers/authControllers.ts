import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db';
import { sendResetPasswordEmail } from '../utils/email';

const JWT_SECRET = 'your_jwt_secret';
const JWT_EXPIRATION = '1h';
const RESET_TOKEN_EXPIRATION = 5 * 60 * 1000; // 5 minutes

export const signup = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
    if (Array.isArray(rows) && rows.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', [firstName, lastName, email, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
      const [rows, _] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const users = rows.map((row: any) => ({ id: row.id, email: row.email, password: row.password }));
      const user = users[0]; // Now TypeScript will understand the structure of user
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  export const getUserDetails = async (req: Request & { userId: string }, res: Response) => {
    const userId = req.userId;
  
    try {
      const [rows, _] = await pool.query('SELECT firstName, lastName, email FROM users WHERE id = ?', [userId]);
      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = rows[0];
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
    const resetTokenExpiration = new Date(Date.now() + RESET_TOKEN_EXPIRATION);

    await pool.query('UPDATE users SET resetToken = ?, resetTokenExpiration = ? WHERE email = ?', [resetToken, resetTokenExpiration, email]);
    await sendResetPasswordEmail(email, resetToken);

    res.json({ message: 'Reset password email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const [rows] = await pool.query('SELECT resetTokenExpiration FROM users WHERE resetToken = ?', [token]);

        // Check if rows exist and if resetTokenExpiration is less than current date
        if (!Array.isArray(rows) || rows.length === 0 || !('resetTokenExpiration' in rows[0]) || new Date(rows[0].resetTokenExpiration) < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiration = NULL WHERE resetToken = ?', [hashedPassword, token]);

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


