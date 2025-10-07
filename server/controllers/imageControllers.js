import axios from "axios";
import userModel from "../models/userModel.js";
import imageModel from "../models/imageModel.js";
import FormData from "form-data";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optional: keep an uploads folder for backward compatibility (not used for new uploads)
const uploadsDir = path.join(__dirname, "../uploads/images");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper: upload buffer to Cloudinary via upload_stream
const uploadBufferToCloudinary = (buffer, options = {}) =>
    new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });

// Generate image using ClipDrop API, upload to Cloudinary, save reference in DB
export const generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;
        const userId = req.user?.id;

        console.log("Generate image request:", { prompt, userId });

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

        if (!process.env.CLIPDROP_API) {
            console.error("ClipDrop API key missing");
            return res.status(500).json({
                success: false,
                message: "API configuration error",
            });
        }

        console.log("Calling ClipDrop API...");

        // Prepare form data for ClipDrop API
        const formData = new FormData();
        formData.append("prompt", prompt);

        const response = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {
                "x-api-key": process.env.CLIPDROP_API,
                ...formData.getHeaders(),
            },
            responseType: "arraybuffer",
            timeout: 60000,
        });

        console.log("ClipDrop API response status:", response.status);

        if (!response.data || response.data.length === 0) {
            throw new Error("Empty response from ClipDrop API");
        }

        // Convert to buffer
        const buffer = Buffer.from(response.data);

        // Upload buffer to Cloudinary
        let cloudResult;
        try {
            cloudResult = await uploadBufferToCloudinary(buffer, { folder: "text2art" });
        } catch (uploadErr) {
            console.error("Cloudinary upload failed:", uploadErr);
            return res.status(500).json({ success: false, message: "Image upload failed" });
        }

        // Cloudinary returned object with secure_url, public_id, format, etc.
        const imageUrl = cloudResult.secure_url; // full https URL
        const filename = `${cloudResult.public_id}.${cloudResult.format}`;

        // Update user credits
        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            { $inc: { creditBalance: -1 } },
            { new: true }
        );

        // Save the generated image reference in DB
        const newGeneration = await imageModel.create({
            userId: user._id,
            prompt,
            imageUrl: imageUrl,
            filename: filename,
            filePath: imageUrl,
        });

        console.log("Image reference saved to database (Cloudinary).");

        // Also send a base64 preview for immediate frontend display if you need it
        const base64Image = buffer.toString("base64");
        const resultImage = `data:image/png;base64,${base64Image}`;

        res.status(200).json({
            success: true,
            message: "Image generated and uploaded successfully",
            resultImage, // immediate preview
            imageUrl, // cloud URL for future display
            creditBalance: updatedUser.creditBalance,
            generationId: newGeneration._id,
        });
    } catch (error) {
        console.error("❌ Generate Image Error:", {
            message: error.message,
            status: error.response?.status,
        });

        if (error.response) {
            if (error.response.status === 403) {
                return res.status(403).json({ success: false, message: "Invalid ClipDrop API key" });
            }
            if (error.response.status === 429) {
                return res.status(429).json({ success: false, message: "Rate limit exceeded for ClipDrop API" });
            }
            if (error.response.status === 400) {
                return res.status(400).json({ success: false, message: "Invalid prompt or API request" });
            }
        }

        if (error.code === "ECONNABORTED") {
            return res.status(408).json({ success: false, message: "Request timeout - image generation taking too long" });
        }

        if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
            return res.status(503).json({ success: false, message: "Service unavailable - cannot reach ClipDrop API" });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error during image generation",
            error: error.message,
        });
    }
};

// Serve image files for legacy /uploads images (unchanged behaviour)
export const serveImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(uploadsDir, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }

        res.setHeader("Content-Type", "image/png");
        res.sendFile(filePath);
    } catch (error) {
        console.error("Error serving image:", error);
        res.status(500).json({ success: false, message: "Error serving image" });
    }
};

// Fetch user generations
export const getUserGenerations = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.json({ success: false, message: "User ID not found" });
        }

        const totalGenerations = await imageModel.countDocuments({ userId });
        const recentGenerations = await imageModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("prompt createdAt _id imageUrl filename")
            .lean();

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

// Test ClipDrop API (unchanged)
export const testClipDrop = async (req, res) => {
    try {
        console.log("Testing ClipDrop API key:", process.env.CLIPDROP_API ? "Exists" : "Missing");

        const formData = new FormData();
        formData.append("prompt", "a cute cat");

        const response = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {
                "x-api-key": process.env.CLIPDROP_API,
                ...formData.getHeaders(),
            },
            responseType: "arraybuffer",
            timeout: 30000,
        });

        res.json({
            success: true,
            message: "ClipDrop API is working",
            status: response.status,
        });
    } catch (error) {
        console.error("ClipDrop test error:", error.response?.status, error.message);
        res.status(500).json({
            success: false,
            message: "ClipDrop test failed",
            error: error.message,
            status: error.response?.status,
        });
    }
};
