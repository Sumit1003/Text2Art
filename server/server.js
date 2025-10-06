import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'

import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const PORT = process.env.PORT || 5000
const app = express()

// CORS configuration
app.use(cors({
    origin: true['http://localhost:3000',
        'https://your-frontend-domain.vercel.app',
        'https://your-frontend-domain.netlify.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

app.options('*', cors());

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

// Database connection with verification
connectDB().then(async () => {
    console.log('MongoDB connected successfully');

    // Verify connection and list databases
    // const adminDb = mongoose.connection.db.admin();
    // const databases = await adminDb.listDatabases();
    // console.log('Available databases:', databases.databases.map(db => db.name));

}).catch(err => {
    console.error('MongoDB connection failed:', err);
});

// Routes
app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)

app.get('/health', (req, res) => res.json({
    message: "API Working fine",
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    databaseName: mongoose.connection.name,
    timestamp: new Date().toISOString()
}))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))