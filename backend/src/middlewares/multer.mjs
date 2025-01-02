import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Simulate __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Directory setup
const uploadDir = path.join(__dirname, '../uploads');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the specified uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const uploads = multer({ storage });
export { uploads };
