import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken'; 
import User from '../Modules/User';
import role from './role.js'; 

const JWT_SECRET = 'master2024';

const authorize = asyncHandler(async (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid or missing token' });
    }
    const token = authHeader.split(' ')[1];
  
    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
      
        // Find the user by ID in the decoded token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        // Log the base URL and path for debugging
        console.log('Requested base URL:', req.baseUrl);
        console.log('Requested path:', req.path);
        console.log('Full URL:', req.originalUrl);
        console.log('User role:', user.role);
        console.log('Allowed routes for role:', role[user.role]);

        // Check if the user's role has access to the requested route
        const routesForRole = role[user.role];
        const requestedRoute = req.originalUrl; // Use originalUrl for full path

        // Simple matching logic; adjust as necessary for dynamic routes
        const isAuthorized = routesForRole.some(route => {
            const regex = new RegExp('^' + route.replace(/:\w+/g, '\\w+') + '$');
            return regex.test(requestedRoute);
        });

        if (!isAuthorized) {
            return res.status(403).json({ message: 'You are not authorized' });
        }
  
        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
});

export default authorize;
