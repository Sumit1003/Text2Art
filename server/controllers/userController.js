import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Register user
export const register = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth } = req.body;

        if (!dateOfBirth) {
            return res.status(400).json({
                success: false,
                message: "Date of birth is required"
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            dateOfBirth: new Date(dateOfBirth)
        });

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                dateOfBirth: user.formattedDob,
                age: user.age,
                creditBalance: user.creditBalance,
                isAdult: user.isAdult()
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during registration",
            error: error.message
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Update last login and login count
        user.lastLogin = new Date();
        user.loginCount += 1;
        await user.save();

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                dateOfBirth: user.formattedDob,
                age: user.age,
                creditBalance: user.creditBalance,
                isAdult: user.isAdult(),
                loginCount: user.loginCount,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during login",
            error: error.message
        });
    }
};

// Verify user for password reset (username + DOB)
export const verifyUserForReset = async (req, res) => {
    try {
        const { name, dateOfBirth } = req.body;

        console.log("🔍 Password Reset Attempt:", { name, dateOfBirth });

        if (!name || !dateOfBirth) {
            console.log("❌ Missing fields");
            return res.status(400).json({
                success: false,
                message: "Username and date of birth are required"
            });
        }

        // Case-insensitive search for user by name
        const user = await userModel.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        console.log("👤 User search result:", user ? `Found: ${user.name}` : "Not found");

        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({
                success: false,
                message: "Invalid username or date of birth"
            });
        }

        // Debug date information
        console.log("📅 Date Debug Info:", {
            userDateOfBirth: user.dateOfBirth,
            userFormattedDob: user.formattedDob,
            inputDateOfBirth: dateOfBirth,
            userDateType: typeof user.dateOfBirth,
            inputDateType: typeof dateOfBirth
        });

        // Verify date of birth with better error handling
        let userDob, inputDob;

        try {
            userDob = new Date(user.dateOfBirth).toISOString().split('T')[0];
            inputDob = new Date(dateOfBirth).toISOString().split('T')[0];

            console.log("📅 DOB Comparison:", {
                userDob,
                inputDob,
                match: userDob === inputDob
            });
        } catch (dateError) {
            console.error("❌ Date parsing error:", dateError);
            return res.status(400).json({
                success: false,
                message: "Invalid date format"
            });
        }

        if (userDob !== inputDob) {
            console.log("❌ DOB mismatch");
            return res.status(400).json({
                success: false,
                message: "Invalid username or date of birth"
            });
        }

        // Generate reset token (valid for 1 hour)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        console.log("✅ Generating reset token");

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        console.log("✅ User verified and token saved");

        res.json({
            success: true,
            message: "User verified successfully. You can now reset your password.",
            resetToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("❌ User verification error:", error);
        console.error("❌ Error details:", {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: "Error verifying user. Please try again.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Reset password with token
export const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword, confirmPassword } = req.body;

        console.log("🔄 Password reset attempt with token");

        if (!resetToken || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Find user by valid reset token
        const user = await userModel.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            console.log("❌ Invalid or expired token");
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token. Please verify your identity again."
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update user password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        console.log("✅ Password reset successful for user:", user.name);

        res.json({
            success: true,
            message: "Password has been reset successfully! You can now login with your new password."
        });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Error resetting password",
            error: error.message
        });
    }
};

// Get user credits
export const getCredits = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            credits: user.creditBalance,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                dateOfBirth: user.formattedDob,
                age: user.age,
                creditBalance: user.creditBalance
            }
        });
    } catch (error) {
        console.error('Credits error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Debug endpoint to check all users (remove in production)
export const debugUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        const userData = users.map(user => ({
            name: user.name,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            formattedDob: user.formattedDob,
            age: user.age
        }));

        console.log("📊 All users in database:", userData);

        res.json({
            success: true,
            users: userData
        });
    } catch (error) {
        console.error('Debug users error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};