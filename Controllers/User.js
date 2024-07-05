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

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        let status = 'disabled';
        
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
            verificationToken  // Add the verification token to the user model
        });

        await newUser.save();

        // Send an email if the role is etudiant
        if (role === 'etudiant') {
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
        }

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


export async function updateUser(req, res) {
    const userId = req.params.id;
    const { nom, prenom, email, login, password, passwordconfirm, phone, role, status } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update user fields
      if (nom) user.nom = nom;
      if (prenom) user.prenom = prenom;
      if (email) user.email = email;
      if (login) user.login = login;
      if (phone) user.phone = phone;
      if (role) user.role = role;
      if (status) user.status = status;
  
      // Update password if provided and passwordconfirm matches
      if (password && password === passwordconfirm) {
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        user.password = hashedPassword;
      } else if (password && password !== passwordconfirm) {
        return res.status(400).json({ error: 'Password confirmation does not match' });
      }
  
      // Save updated user
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: error.message });
    }
  }


// Function to generate a password reset token and send reset email
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Generate a unique token for password reset
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 36000; // Token expires in 1 hour

        await user.save();

        // Send password reset email
        const resetLink = `http://localhost:4200/#/resetpassword/${resetToken}`;
        const mailOptions = {
            from: 'meher.fe08@gmail.com', // sender address (must be Gmail)
            to: email, // recipient email
            subject: 'Réinitialisation de mot de passe',
            html: `<p>Bonjour,</p>
                   <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                   <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
                   <p><a href="${resetLink}">${resetLink}</a></p>
                   <p>Ce lien expirera dans 5 minutes.</p>
                   <p>Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Un email de réinitialisation de mot de passe a été envoyé.' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ error: error.message });
    }
};




// Function to verify reset token and update password
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Le lien de réinitialisation est invalide ou a expiré.' });
        }

        // Ensure newPassword is provided
        if (!newPassword) {
            return res.status(400).json({ error: 'New password is required.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: error.message });
    }
};







// Function to render reset password page
export async function resetPasswordPage(req, res) {
    const { token } = req.params;

    try {
        // Find the user by the reset password token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Check if token is not expired
        });

        if (!user) {
            return res.status(404).json({ error: 'Token invalid or expired' });
        }

        // Render your reset password page here (replace 'reset-password' with your actual page name)
        res.render('reset-password/', { token }); // Pass the token to your reset password page
    } catch (error) {
        console.error('Error rendering reset password page:', error);
        res.status(500).json({ error: error.message });
    }
}



export const getUserProfile = async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        login: user.login,
        phone: user.phone,
        role: user.role,
        status: user.status,
      };
    } catch (error) {
      throw error;
    }
  };