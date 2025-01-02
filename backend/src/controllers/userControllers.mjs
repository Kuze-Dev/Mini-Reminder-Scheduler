import {addUserModel,loginUserModel} from '../models/userModels.mjs'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with an environment variable


export async function addUser(req, res) {
    const user_id = uuidv4(); // Generate a new UUID for the user ID
    const { firstname, lastname, email, password } = req.body;
    const profileImage = req.file.filename;
    const passwordHash = bcrypt.hashSync(password, 2); // Sync hash
    const data = [user_id, firstname, lastname, email, passwordHash, profileImage];
    
    addUserModel(data, (err, results) => {
        if (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.json({ failed: 'false', msg: 'Email is already in use.' });
            } else {
                return res.json({ failed: 'false', message: 'Failed To Add User' });
            }
        }
        res.json({ success: 'true', message: 'User Added Successfully' });
    });
}


export async function loginUser(req, res) {
    const { email, password } = req.body;

    // Call the model to validate user
    loginUserModel(email, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: 'false', message:'Internal server error' });
        }

        // If user not found
        if (results.length === 0) {
            return res.status(401).json({ success: 'false', message: 'User not found' });
        }

        const user = results[0];

        // Compare the provided password with the stored hash
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: 'false', message: 'Invalid Credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: 'true', message: 'Login successful.', token });
    });
  }