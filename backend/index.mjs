import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as eventRoutes } from './src/routes/eventRoutes.mjs';

dotenv.config();

const app = express();

app.use(express.json())
app.use(cors());
app.use(eventRoutes);

const port = process.env.SERVER_PORT;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

