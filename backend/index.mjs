import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { router as userRoutes } from './src/routes/userRoutes.mjs'
import { router as scheduleRoutes } from './src/routes/scheduleRoutes.mjs';


// Manually define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();


app.use(express.json())
app.use(cors());
app.use(scheduleRoutes);
app.use(userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));


const port = process.env.SERVER_PORT;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

