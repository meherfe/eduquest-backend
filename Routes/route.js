import express from 'express';
import { userValidation } from '../Validators/uservalidator.js';
import { addUser, getAllUsers, archiveUser, updateUser , requestPasswordReset , resetPassword , resetPasswordPage, getUserProfile} from '../Controllers/user.js';
import { authUser, logout } from '../Controllers/userauth.js'; // Import the logout function
import authorize from './authorization.js'; // Import the default export
import User from '../Modules/User'; // Import the User model
import * as courseSpaceController from '../Controllers/courseSpaceController.js';
import { getAllAssignments, createAssignment, updateAssignment, deleteAssignment, getAssignmentByCategory } from '../Controllers/assignementController.js';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../Controllers/categoryController.js';
import { authMiddleware } from './authMiddleware.js';

const router = express.Router();


router.use(express.json()); // Parse JSON bodies for this router
// Meher Route

// Route to authenticate a user
router.post('/auth', authUser);

// Route to add a new user (restricted to specific roles)
router.post('/User', userValidation, addUser);

// Route to archive a user
router.patch('/User/:id', archiveUser);

// Route to get all users (restricted to specific roles)
router.get('/users', authorize, getAllUsers);

// Route to modify a profile
router.put('/User/:id', authorize, userValidation, updateUser);

// Route to verify email
router.get('/verify-email', async (req, res) => {
    const { token, email } = req.query;

    try {
        const user = await User.findOne({ email, verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token or email' });
        }

        user.status = 'enabled';
        user.verificationToken = undefined; // Remove the token after verification
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ error: error.message });
    }
});

// Ranim route

// Create a new course space
router.post('/coursespace', authorize, courseSpaceController.createCourseSpace);

// Add a category to a course space
router.post('/coursespace/:id/categories', authorize, courseSpaceController.addCategory);

// Upload a course file
router.post('/:id/courses', authorize, courseSpaceController.uploadCourse);

// Assign an etudiant to a coursespace
router.post('/coursespace/:courseSpaceId/etudiant/:etudiantId/assign', authorize, courseSpaceController.assignEtudiantToCourseSpace);

// Get all course spaces for a professor
router.get('/professor/:professorId', authorize, courseSpaceController.getCourseSpacesByProfessor);

// Get all course spaces for a student
router.get('/student/:studentId', authorize, courseSpaceController.getCourseSpacesByStudent);

// Sarra routes

router.get('/assignment', getAllAssignments);

router.post('/assignment', createAssignment);

router.put('/assignment/:assignmentId', updateAssignment);

router.delete('/assignment/:assignmentId', deleteAssignment);

router.get('/assignments/category/:categoryId', getAssignmentByCategory);

router.get('/category', getAllCategories);

router.post('/category', createCategory);

router.put('/category/:categoryId', updateCategory);

router.delete('/category/:categoryId', deleteCategory);

// Logout route
router.post('/logout', logout);

// Route to request password reset (POST /reset-password/request)
router.post('/reset-password/request', requestPasswordReset);

// Route to reset password with token (POST /reset-password/reset)
router.post('/reset-password/reset', resetPassword);


router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Check if token is not expired
        });

        if (!user) {
            return res.status(404).json({ error: 'Token invalid or expired' });
        }

        // If token is valid, return a success response
        console.log('valid token');
        res.status(200).json({ message: 'Token valid', token: token });
    } catch (error) {
        console.error('Error verifying reset token:', error);
        res.status(500).json({ error: error.message });
    }
});



// Profile route
router.get('/profile', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id; // Assuming the user ID is stored in the token and extracted by authMiddleware
      const userProfile = await getUserProfile(userId);
      res.status(200).json(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: error.message });
    }
  });
  

// Get the count of users with admin role
router.get('/admin-count', async (req, res) => {
    try {
      const adminCount = await User.countDocuments({ role: 'admin' });
      res.status(200).json({ count: adminCount });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching admin count', error });
    }
  });


  // Get the count of users with etudiant role
router.get('/etudiant-count', async (req, res) => {
    try {
      const etudiantCount = await User.countDocuments({ role: 'etudiant' });
      res.status(200).json({ count: etudiantCount });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching etudiant count', error });
    }
  });

// Get the count of users with enseignant role
router.get('/enseignant-count', async (req, res) => {
    try {
      const enseignantCount = await User.countDocuments({ role: 'enseignant' });
      res.status(200).json({ count: enseignantCount });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching etudiant count', error });
    }
  });

  // Get the count of users with enseignant role
router.get('/archived-count', async (req, res) => {
    try {
      const archivedCount = await User.countDocuments({ status: 'archived' });
      res.status(200).json({ count: archivedCount });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching etudiant count', error });
    }
  });






export default router;
