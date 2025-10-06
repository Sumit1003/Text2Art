import express from 'express';
import {
    login,
    register,
    getCredits,
    verifyUserForReset,
    resetPassword,
    debugUsers // Add this
} from '../controllers/userController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-for-reset', verifyUserForReset);
router.post('/reset-password', resetPassword);

// Debug route (remove in production)
router.get('/debug-users', debugUsers);

// Protected routes
router.get('/credits', auth, getCredits);

// Token validation endpoint
router.get('/check-token', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Token is valid',
            user: {
                id: req.user.id
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

export default router;