import nodemailer from 'nodemailer';
import { config } from '../config/config';

const transporter = nodemailer.createTransport(config.email);

export const sendResetPasswordEmail = async (to: string, resetToken: string) => {
  const mailOptions = {
    from: config.email.auth.user,
    to,
    subject: 'Reset Your Password',
    html: `<p>Click the following link to reset your password:</p><a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset password email sent successfully');
  } catch (error) {
    console.error('Error sending reset password email:', error);
  }
};
