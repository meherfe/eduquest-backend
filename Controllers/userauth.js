import User from "../Modules/User"; // Ensure the correct import path
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

const JWT_SECRET = 'master2024';
const JWT_EXPIRES_IN = '1h';

export const authUser = asyncHandler(async (req, res, next) => {
  const { login, password } = req.body;

  const user = await User.findOne({ login });

  if (!user) {
    return res.status(401).json({ message: 'login ou mot de passe incorrect' });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'login ou mot de passe incorrect' });
  }

  if (user.status === 'archived') {
    return res.status(403).json({ message: 'vous êtes un utilisateur archivé , veuillez contactez votre administrateur' });
  }

  if (user.status !== 'enabled') {
    return res.status(403).json({ message: 'Veuillez contacter votre administrateur pour activer votre compte' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, login: user.login, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.status(200).json({
    message: 'Authentication successful',
    token: token
  });
});
