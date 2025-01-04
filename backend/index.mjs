import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as userRoutes } from './src/routes/userRoutes.mjs'
import { router as scheduleRoutes } from './src/routes/scheduleRoutes.mjs';


dotenv.config();

const app = express();

app.use(express.json())
app.use(cors());
app.use(scheduleRoutes);
app.use(userRoutes);

const port = process.env.SERVER_PORT;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

