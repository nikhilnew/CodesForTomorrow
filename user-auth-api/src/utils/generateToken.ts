import jwt from 'jsonwebtoken';
import { config } from '../config/config';


export const generateToken = (userId: number) => {
  return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: '5m' }); // Set expiry time to 5 minutes
};

