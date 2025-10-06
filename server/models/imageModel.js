import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    imagePath: {  // Add this field to store file path
        type: String,
    },
    filename: {   // Add this field to store filename
        type: String,
    },
    style: {
        type: String,
        default: 'general',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    collection: 'images'
});

export default mongoose.model('Image', imageSchema);