import {addUser,loginUser,getProfileData} from '../controllers/userControllers.mjs'
import { uploads } from '../middlewares/multer.mjs'
import express from 'express';

const router = express.Router();

router.post('/login',loginUser);
router.post('/user',uploads.single('profileImage'),addUser);
router.get('/user/:id',getProfileData);
// router.get('/user',getUser);
// router.put('/user/:id',putUser);
// router.delete('/user/:id',deleteUser);


export {router};