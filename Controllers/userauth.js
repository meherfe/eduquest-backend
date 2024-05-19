import User from "../Modules/User";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = 'your_jwt_secret'; // Replace with your own secret key
const JWT_EXPIRES_IN = '1h'; // Token expiration time (1 hour, for example)

export const authUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ login: req.body.login });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ message: 'Incorrect login or password' });
  }

  if (user.status === 'disabled') {
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
