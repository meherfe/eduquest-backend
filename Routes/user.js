import express from 'express';
import { userValidation } from '../Validators/uservalidator.js';
import { addUser } from '../Controllers/User.js';
import { authUser } from '../Controllers/userauth.js';

const router = express.Router();

// Route to add a new user
router.post('/User', userValidation, addUser);

// Route to authenticate a user
router.post('/auth', authUser);

export default router;
