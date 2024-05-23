export const config = {
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  email: {
    service: process.env.EMAIL_SERVICE || 'Gmail',
    auth: {
      user: process.env.EMAIL_USER || 'nikhilkurmi361@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'Nikhil@123'
    }
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'managment'
  },
  resetPasswordTokenExpiry: 5 * 60 * 1000 // 5 minutes in milliseconds
};
