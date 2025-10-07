import express from 'express';
import {
    uploadImage,
    removeBackground,
    upscaleImage,
    enhanceImage,
    optimizeImage,
    uploadUserImage
} from '../controllers/cloudinaryController.js';
import userAuth from '../middlewares/auth.js';

const router = express.Router();

router.post('/upload', userAuth, uploadImage);
router.post('/upload-user-image', userAuth, uploadUserImage);
router.post('/remove-background', userAuth, removeBackground);
router.post('/upscale', userAuth, upscaleImage);
router.post('/enhance', userAuth, enhanceImage);
router.post('/optimize', userAuth, optimizeImage);

export default router;