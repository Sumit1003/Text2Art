import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 5000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded images
const uploadsDir = path.join(__dirname, 'uploads', 'images');
app.use('/api/images', express.static(uploadsDir));

// CORS
app.use(cors({
    origin: [
        'https://text2art1.onrender.com',
        'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
}));

app.options('*', cors());

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

// DB Connect
connectDB()
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection failed:', err));

// Routes
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);
app.use('/api/gallery', imageRouter); // Alias for gallery routes
app.use('/results', imageRouter); // Alias for results routes

// Health check
app.get('/health', (req, res) => {
    res.json({
        message: 'API Working fine',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        databaseName: mongoose.connection.name,
        timestamp: new Date().toISOString(),
    })
});

// Serve React build in production
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
//     });
// }

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
