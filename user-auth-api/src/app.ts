import express from 'express';
import bodyParser from 'body-parser';
import { authRouter } from './routes/authRoutes';
// import { sequelize } from './config/database';
import dotenv from 'dotenv';
import sequelize from './config/database'
dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

export default app;
