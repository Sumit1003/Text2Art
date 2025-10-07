import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const cloudinaryService = {
    // Upload image (for user uploads)
    uploadImage: async (imageData, token) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/cloudinary/upload-user-image`,
                { imageBase64: imageData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Upload failed' };
        }
    },

    // Remove background
    removeBackground: async (imageUrl, token) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/cloudinary/remove-background`,
                { imageUrl },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Background removal failed' };
        }
    },

    // Upscale image
    upscaleImage: async (imageUrl, token) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/cloudinary/upscale`,
                { imageUrl },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Upscaling failed' };
        }
    },

    // Enhance image
    enhanceImage: async (imageUrl, token) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/cloudinary/enhance`,
                { imageUrl },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Enhancement failed' };
        }
    },

    // Optimize image
    optimizeImage: async (imageUrl, options = {}, token) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/cloudinary/optimize`,
                {
                    imageUrl,
                    width: options.width,
                    height: options.height,
                    format: options.format,
                    quality: options.quality
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Optimization failed' };
        }
    }
};