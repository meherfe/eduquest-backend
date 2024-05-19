import express from 'express';
import { userValidation } from '../Validators/uservalidator.js';
import { addUser , getAllUsers, updateUser } from '../Controllers/User.js';
import { authUser  } from '../Controllers/userauth.js';
import { deleteUser } from '../Controllers/User.js';


const router = express.Router();

// Route to add a new user
router.post('/User', userValidation, addUser);

// Route to authenticate a user
router.post('/auth', authUser);

//delete user

router.delete('/User/:id', deleteUser);

// Route to get all users
router.get('/Users', getAllUsers);

router.put('/User/:id', userValidation, updateUser);

export default router;
