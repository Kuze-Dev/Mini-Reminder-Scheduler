import {addUserModel,loginUserModel,getProfileDataModel,getAllUserModel, updateUserStatusModel,deleteUserModel,updateUserModel} from '../models/userModels.mjs'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with an environment variable


export async function addUser(req, res) {
    const user_id = uuidv4(); // Generate a new UUID for the user ID
    const { firstname, lastname, email, password} = req.body;
    const profileImage = req.file.filename;
    const passwordHash = bcrypt.hashSync(password, 10); // Sync hash
    const data = [user_id, firstname, lastname, email, passwordHash,'User','Active', profileImage];
    
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
            return res.status(500).json({ failed: 'false', msg:'Internal server error' });
        }

        // If user not found
        if (results.length === 0) {
            return res.status(401).json({ failed: 'false', msg: 'User not found' });
        }

        const user = results[0];

        // Compare the provided password with the stored hash
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ failed: 'false', msg: 'Invalid Credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign({user_id: user.user_id, email: user.email}, JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: 'true', message: 'Login successful.', token });
    });
  }


  export function getProfileData(req,res){
     const userId = req.params.id;
     const data =[userId];
     getProfileDataModel(data,(err,results)=>{
    if(err){
        console.error(err);
        return res.json({failed:'false',msg:'Failed to Retrieve Profile User'});
    }else{
        res.json({success:'true',results});
    }
     })
  }

  export function getAllUser(req,res){
    const page = parseInt(req.query.page) || 1;      
  const limit = parseInt(req.query.limit) || 6;       
  const offset = (page - 1) * limit;     
    getAllUserModel(limit, offset,(err,results)=>{
        if(err){
            console.error(err);
            return res.json({failed:'false',msg:'Failed to Retrieve All User'});
        }else{
            res.json({results: results.rows,
                totalUsers: results.total,
                currentPage: page,  
                perPage: limit,  });
        }
    })
  }


  export function updateUserStatus(req, res) {
    const { id } = req.params; 
    const { status } = req.body; // Get updated data from request body
  
    const data = [status,id];
  
    updateUserStatusModel(data, (err,results) => {
      if (err) { 
        console.error(err);
        return res.json({ failed: 'Failed to Update Status' });
      } else {
        res.json({ success: 'true', msg: 'Status Updated Successfully' });
      }
    });
  }

  export function deleteUser(req, res) {
    const { id } = req.params; 
    const data = [id];
   deleteUserModel(data, (err,results) => {
      if (err) { 
        console.error(err);
        return res.json({ failed: 'Failed to Delete User' });
      } else {
        res.json({ success: 'true', msg: 'User Deleted Successfully' });
      }
    });
  }

  export function updateUser(req, res) {
    const { id } = req.params; 
    const {firstname,lastname,email,password} = req.body; // Get updated data from request body
    const profileImage = req.file.filename;
    const passwordHash = bcrypt.hashSync(password, 10); // Sync hash
    const data = [firstname, lastname, email,passwordHash,profileImage, id];
  
    updateUserModel(data, (err,results) => {
      if (err) { 
        console.error(err);
        return res.json({ failed: 'Failed to Update User' });
      } else {
        res.json({ success: 'true', msg: 'User Updated Successfully' });
      }
    });
  }