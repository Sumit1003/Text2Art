import cloudinary from '../config/cloudinary.js';

// Upload image to Cloudinary (for base64)
export const uploadImage = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'Image data is required'
            });
        }

        const result = await cloudinary.uploader.upload(image, {
            folder: 'Text2Art',
            quality: 'auto:good',
            fetch_format: 'auto'
        });

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Image upload failed: ' + error.message
        });
    }
};

// Upload user image (for file uploads)
export const uploadUserImage = async (req, res) => {
    try {
        const { imageBase64 } = req.body;

        if (!imageBase64) {
            return res.status(400).json({
                success: false,
                message: 'Image data is required'
            });
        }

        const result = await cloudinary.uploader.upload(imageBase64, {
            folder: 'Text2Art/user-uploads',
            quality: 'auto:good',
            fetch_format: 'auto'
        });

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Image upload failed: ' + error.message
        });
    }
};

// AI Background Removal
export const removeBackground = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: 'Text2Art/background-removed',
            effect: 'background_removal',
            quality: 'auto:good'
        });

        res.json({
            success: true,
            message: 'Background removed successfully',
            resultImage: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Background removal error:', error);
        res.status(500).json({
            success: false,
            message: 'Background removal failed: ' + error.message
        });
    }
};

// AI Image Upscaling
export const upscaleImage = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: 'Text2Art/upscaled',
            transformation: [
                {
                    width: 2000,
                    crop: 'limit',
                    quality: 'auto:best'
                }
            ]
        });

        res.json({
            success: true,
            message: 'Image upscaled successfully',
            resultImage: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Upscale error:', error);
        res.status(500).json({
            success: false,
            message: 'Image upscaling failed: ' + error.message
        });
    }
};

// AI Image Enhancement
export const enhanceImage = async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: 'Text2Art/enhanced',
            transformation: [
                {
                    effect: 'improve:outdoor',
                    quality: 'auto:best'
                },
                {
                    effect: 'auto_contrast'
                }
            ]
        });

        res.json({
            success: true,
            message: 'Image enhanced successfully',
            resultImage: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Enhancement error:', error);
        res.status(500).json({
            success: false,
            message: 'Image enhancement failed: ' + error.message
        });
    }
};

// Image Optimization & Delivery
export const optimizeImage = async (req, res) => {
    try {
        const { imageUrl, width, height, format, quality } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        const transformation = [];

        if (width || height) {
            transformation.push({
                width: width || null,
                height: height || null,
                crop: 'fill',
                gravity: 'auto'
            });
        }

        transformation.push({
            quality: quality || 'auto:good',
            fetch_format: format || 'auto'
        });

        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: 'Text2Art/optimized',
            transformation
        });

        res.json({
            success: true,
            message: 'Image optimized successfully',
            optimizedUrl: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Optimization error:', error);
        res.status(500).json({
            success: false,
            message: 'Image optimization failed: ' + error.message
        });
    }
};

// REMOVE THE DUPLICATE EXPORTS SECTION AT THE BOTTOM
// Just let the individual exports above handle everything