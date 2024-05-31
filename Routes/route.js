import express from 'express';
import { userValidation } from '../Validators/uservalidator.js';
import { addUser, getAllUsers, archiveUser, updateUser} from '../Controllers/user.js';
import { authUser } from '../Controllers/userauth.js';
import authorize from './authorization.js'; // Import the default export
import User from '../Modules/User'; // Import the User model
import * as courseSpaceController from '../Controllers/courseSpaceController.js';
import { getAllAssignments } from '../Controllers/assignementController.js';
import { createAssignment , updateAssignment, deleteAssignment, getAssignmentByCategory} from '../Controllers/assignementController.js';
import { getAllCategories , createCategory , updateCategory, deleteCategory} from '../Controllers/categoryController.js';

const router = express.Router();


//Meher Route


// Route to authenticate a user
router.post('/auth', authUser);

// Route to add a new user (restricted to specific roles)
router.post('/User', authorize, userValidation, addUser);

// Route to delete a user
router.patch('/User/:id', authorize, archiveUser);

// Route to get all users (restricted to specific roles)
router.get('/Users', authorize, getAllUsers);

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





//Ranim route

// Create a new course space
router.post("/coursespace", courseSpaceController.createCourseSpace);

// Add a category to a course space
router.post("/coursespace/:id/categories", courseSpaceController.addCategory);

// Upload a course file
router.post("/:id/courses", courseSpaceController.uploadCourse);



// Assign an etudiant to a coursespace
router.post("/coursespace/:courseSpaceId/etudiant/:etudiantId/assign", courseSpaceController.assignEtudiantToCourseSpace);




// Get all course spaces for a professor
router.get(
  "/professor/:professorId",
  courseSpaceController.getCourseSpacesByProfessor
);

// Get all course spaces for a student
router.get(
  "/student/:studentId",
  courseSpaceController.getCourseSpacesByStudent
);



//sarra routes 


router.get('/assignment', getAllAssignments);

router.post('/assignment', createAssignment);

router.put('/assignment/:assignmentId', updateAssignment);

router.delete('/assignment/:assignmentId', deleteAssignment);

router.get('/assignmentByCategory', getAssignmentByCategory);

router.get('/category', getAllCategories);

router.post('/category', createCategory);

router.put('/category/:categoryId', updateCategory);

router.delete('/category/:categoryId', deleteCategory);

export default router;
