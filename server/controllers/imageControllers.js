import axios from 'axios';
import userModel from "../models/userModel.js";
import imageModel from "../models/imageModel.js";
import FormData from "form-data";
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/images');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Generate image using ClipDrop API
export const generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;
        const userId = req.user?.id;

        console.log('Generate image request:', { prompt, userId });

        if (!prompt) {
            return res.status(400).json({ success: false, message: "Prompt is required" });
        }

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.creditBalance <= 0) {
            return res.status(402).json({
                success: false,
                message: "No credit balance left",
                creditBalance: user.creditBalance,
            });
        }

        // Check if ClipDrop API key is available
        if (!process.env.CLIPDROP_API) {
            console.error('ClipDrop API key missing');
            return res.status(500).json({
                success: false,
                message: "API configuration error"
            });
        }

        console.log('Calling ClipDrop API...');

        // Prepare form data for ClipDrop API
        const formData = new FormData();
        formData.append("prompt", prompt);

        const response = await axios.post(
            "https://clipdrop-api.co/text-to-image/v1",
            formData,
            {
                headers: {
                    "x-api-key": process.env.CLIPDROP_API,
                    ...formData.getHeaders(),
                },
                responseType: "arraybuffer",
                timeout: 60000,
            }
        );

        console.log('ClipDrop API response status:', response.status);

        if (!response.data || response.data.length === 0) {
            throw new Error('Empty response from ClipDrop API');
        }

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `image_${userId}_${timestamp}.png`;
        const filePath = path.join(uploadsDir, filename);

        // Save image as file
        fs.writeFileSync(filePath, response.data);
        console.log('Image saved as file:', filename);

        // Create clean URL (not Base64)
        const imageUrl = `/api/images/${filename}`;

        // Update user credits
        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            { $inc: { creditBalance: -1 } },
            { new: true }
        );

        // Save the generated image in DB with file reference
        const newGeneration = await imageModel.create({
            userId: user._id,
            prompt,
            imageUrl: imageUrl, // Now stores clean URL, not Base64
            filename: filename,
            filePath: filePath
        });

        console.log('Image reference saved to database');

        // For immediate frontend display, you can still send Base64 in response
        const base64Image = Buffer.from(response.data).toString("base64");
        const resultImage = `data:image/png;base64,${base64Image}`;

        res.status(200).json({
            success: true,
            message: "Image generated successfully",
            resultImage, // Send Base64 for immediate display
            imageUrl,    // Also send the clean URL for future use
            creditBalance: updatedUser.creditBalance,
            generationId: newGeneration._id,
        });

    } catch (error) {
        console.error("❌ Generate Image Error:", {
            message: error.message,
            status: error.response?.status,
        });

        // Handle specific ClipDrop errors
        if (error.response) {
            if (error.response.status === 403) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid ClipDrop API key",
                });
            }

            if (error.response.status === 429) {
                return res.status(429).json({
                    success: false,
                    message: "Rate limit exceeded for ClipDrop API",
                });
            }

            if (error.response.status === 400) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid prompt or API request",
                });
            }
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            return res.status(408).json({
                success: false,
                message: "Request timeout - image generation taking too long"
            });
        }

        // Handle network errors
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                message: "Service unavailable - cannot reach ClipDrop API"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error during image generation",
            error: error.message,
        });
    }
};

// Add this new endpoint to serve image files
export const serveImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(uploadsDir, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }

        // Set appropriate headers and send file
        res.setHeader('Content-Type', 'image/png');
        res.sendFile(filePath);
    } catch (error) {
        console.error("Error serving image:", error);
        res.status(500).json({ success: false, message: "Error serving image" });
    }
};

// Fetch user generations - UPDATED to handle both old and new data
export const getUserGenerations = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.json({ success: false, message: "User ID not found" });
        }

        const totalGenerations = await imageModel.countDocuments({ userId });
        const recentGenerations = await imageModel.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("prompt createdAt _id imageUrl filename")
            .lean(); // Convert to plain objects

        const uniqueStyles = await imageModel.distinct("style", { userId });

        res.json({
            success: true,
            totalGenerations,
            recentGenerations,
            uniqueStyles: uniqueStyles.length,
        });
    } catch (error) {
        console.error("Error in getUserGenerations:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Fetch single generation
export const getGeneration = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!userId || !id) {
            return res.json({ success: false, message: "Missing required parameters" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Invalid generation ID" });
        }

        const generation = await imageModel.findOne({ _id: id, userId });
        if (!generation) {
            return res.json({ success: false, message: "Generation not found" });
        }

        res.json({
            success: true,
            generation: {
                _id: generation._id,
                prompt: generation.prompt,
                imageUrl: generation.imageUrl,
                createdAt: generation.createdAt,
                filename: generation.filename,
            },
        });
    } catch (error) {
        console.error("Error in getGeneration:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Test ClipDrop API (temporary)
export const testClipDrop = async (req, res) => {
    try {
        console.log('Testing ClipDrop API key:', process.env.CLIPDROP_API ? 'Exists' : 'Missing');

        const formData = new FormData();
        formData.append("prompt", "a cute cat");

        const response = await axios.post(
            "https://clipdrop-api.co/text-to-image/v1",
            formData,
            {
                headers: {
                    "x-api-key": process.env.CLIPDROP_API,
                    ...formData.getHeaders(),
                },
                responseType: "arraybuffer",
                timeout: 30000,
            }
        );

        res.json({
            success: true,
            message: 'ClipDrop API is working',
            status: response.status
        });
    } catch (error) {
        console.error('ClipDrop test error:', error.response?.status, error.message);
        res.status(500).json({
            success: false,
            message: 'ClipDrop test failed',
            error: error.message,
            status: error.response?.status
        });
    }
};