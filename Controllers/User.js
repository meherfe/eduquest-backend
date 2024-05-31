import User from '../Modules/User';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'meher.fe08@gmail.com',
        pass: 'kbijoebavdtepnzx' // Utilisez le mot de passe spécifique à l'application
    }
});

export async function addUser(req, res) {

   
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log('Validation Errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { nom, prenom, email, login, password, phone, role } = req.body;

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Générer un token de vérification
        const verificationToken = crypto.randomBytes(32).toString('hex');

        let status = 'disabled';
        console.log('Role:', role);
        // If the role is enseignant, set the status to enabled by default
        if (role === 'enseignant') {
            status = 'enabled';
        }

        const newUser = new User({
            nom,
            prenom,
            email,
            login,
            password: hashedPassword,
            phone,
            role,
            status,
            verificationToken  // Ajouter le token de vérification au modèle utilisateur
        });

        await newUser.save();

        // Envoyer un email de confirmation
        const verificationLink = `http://localhost:9090/verify-email?token=${verificationToken}&email=${email}`;
        const mailOptions = {
            from: 'meher.fe08@gmail.com',
            to: email,
            subject: 'Account Verification',
            text: `Your account has been added. Please verify your email by clicking on the link below:\n${verificationLink}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(200).json(newUser);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: error.message });
    }
}

// Update user status to archived function
export const archiveUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'utilisateur non trouvé' });
        }

        user.status = 'archived';
        await user.save();

        res.status(200).json({
            message: 'le status de lutilisateur est : archived',
            user
        });
    } catch (error) {
        console.error('Error archiving user:', error);
        res.status(500).json({ error: error.message });
    }
};



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
                return res.status(404).json({ error: 'utilisateur non trouvé' });
            }

            // Update user fields
            if (nom) user.nom = nom;
            if (prenom) user.prenom = prenom;
            if (email) user.email = email;
            if (login) user.login = login;
            if (password) user.password ;
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






