import {addUser,loginUser,getProfileData,getAllUser,updateUserStatus,deleteUser,updateUser} from '../controllers/userControllers.mjs'
import { upload } from '../middlewares/multer.mjs'
import express from 'express';

const router = express.Router();

router.post('/login',loginUser);
router.post('/user',upload.single('profileImage'),addUser);
router.get('/user/:id',getProfileData);
router.get('/user',getAllUser)
router.put('/user/status/:id',updateUserStatus);
router.put('/user/:id',upload.single('profileImage'),updateUser);
router.delete('/user/:id',deleteUser); 


// router.get('/user',getUser);
// router.put('/user/:id',putUser);
// router.delete('/user/:id',deleteUser);


export {router};