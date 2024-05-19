import User from '../Modules/User';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

// Add User function (unchanged)
export function addUser(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log('Validation Errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { nom, prenom, email, login, password, phone, role } = req.body;

        // Create a new user instance
        const newUser = new User({
            nom,
            prenom,
            email,
            login,
            password,
            phone,
            role,
        });

        // Save the user to the database
        newUser.save()
            .then(() => {
                res.status(200).json(newUser);
            })
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: error.message });
    }
}

// Delete User function
export function deleteUser(req, res) {
    const userId = req.params.id;

    User.findByIdAndDelete(userId)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: error.message });
        });
}


// Get All Users function

export function getAllUsers(req, res) {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: error.message });
        });
}




// Update User function with password hashing
export function updateUser(req, res) {
    const userId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nom, prenom, email, login, password, phone, role, status } = req.body;

    User.findById(userId)
        .then(async user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update user fields
            if (nom) user.nom = nom;
            if (prenom) user.prenom = prenom;
            if (email) user.email = email;
            if (login) user.login = login;
            if (password) user.password = await bcrypt.hash(password, 12);
            if (phone) user.phone = phone;
            if (role) user.role = role;
            if (status) user.status = status;

            return user.save();
        })
        .then(updatedUser => res.status(200).json(updatedUser))
        .catch(error => {
            console.error('Error updating user:', error);
            res.status(500).json({ error: error.message });
        });
}