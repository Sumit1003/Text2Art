import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('token');

        console.log('Auth middleware: Token received:', !!token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth middleware: Token verified:', true);
        console.log('Auth middleware: User ID from token:', decoded.id);

        // Check if user still exists in database
        const user = await userModel.findById(decoded.id);
        if (!user) {
            console.log('Auth middleware: User not found in database:', decoded.id);
            return res.status(404).json({
                success: false,
                message: 'User not found. Please login again.'
            });
        }

        req.user = { id: user._id.toString() };
        console.log('Auth middleware: User authenticated with ID:', req.user.id);
        next();
    } catch (error) {
        console.log('Auth middleware: Token verification failed:', error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

export default auth;