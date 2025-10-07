import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Route imports
import cloudinaryRoutes from './routes/cloudinaryRoutes.js';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 5000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", "https://api.cloudinary.com"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: 900 // 15 minutes in seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// More aggressive limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: {
        error: 'Too many authentication attempts, please try again later.',
        retryAfter: 900
    }
});

app.use('/api/user/login', authLimiter);
app.use('/api/user/register', authLimiter);
app.use('/api/user/reset-password', authLimiter);

// Compression
app.use(compression());

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS Configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://text2art.onrender.com',
    'https://imagify-ai-app.vercel.app',
    // Add your production domains here
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            console.warn('CORS Blocked:', origin);
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'token',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
    ],
    exposedHeaders: [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset'
    ],
    maxAge: 86400 // 24 hours
}));

// Handle preflight requests
app.options('*', cors());

// Trust proxy (important for rate limiting and secure cookies in production)
app.set('trust proxy', 1);

// Middleware
app.use(express.json({
    limit: '50mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 100000 // Increase if needed for large payloads
}));
app.use(cookieParser());

// Serve uploaded images
const uploadsDir = path.join(__dirname, 'uploads', 'images');
app.use('/api/images', express.static(uploadsDir));

// Custom logging middleware with more details
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';

    console.log(`${timestamp} - IP: ${clientIP} - ${req.method} ${req.path} - Origin: ${req.headers.origin} - UA: ${userAgent.substring(0, 50)}...`);

    // Log large request bodies in development
    if (process.env.NODE_ENV !== 'production' && req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', JSON.stringify(req.body).substring(0, 500) + '...');
    }

    next();
});

// Database Connection with retry logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
    try {
        await connectDB();
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error(`❌ MongoDB connection failed (${retries} retries left):`, error.message);
        if (retries > 0) {
            console.log(`Retrying connection in ${delay / 1000} seconds...`);
            setTimeout(() => connectWithRetry(retries - 1, delay), delay);
        } else {
            console.error('💥 MongoDB connection failed after all retries');
            process.exit(1);
        }
    }
};

// Initialize database connection
connectWithRetry();

// Routes with versioning
app.use('/api/v1/user', userRouter);
app.use('/api/v1/image', imageRouter);
app.use('/api/v1/gallery', imageRouter); // Alias for gallery routes
app.use('/api/v1/cloudinary', cloudinaryRoutes);

// API Health check with detailed status
app.get('/health', async (req, res) => {
    const healthCheck = {
        message: '🚀 Imagify AI API is running smoothly',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: {
            status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
            name: mongoose.connection.name,
            host: mongoose.connection.host,
            readyState: mongoose.connection.readyState
        },
        system: {
            nodeVersion: process.version,
            platform: process.platform,
            memory: process.memoryUsage(),
            pid: process.pid
        }
    };

    // Check database connectivity
    try {
        await mongoose.connection.db.admin().ping();
        healthCheck.database.ping = 'OK';
    } catch (error) {
        healthCheck.database.ping = 'FAILED';
        healthCheck.database.error = error.message;
    }

    const status = healthCheck.database.status === 'Connected' && healthCheck.database.ping === 'OK' ? 200 : 503;

    res.status(status).json(healthCheck);
});

// API Status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        status: 'operational',
        version: '1.0.0',
        service: 'Imagify AI Backend',
        timestamp: new Date().toISOString(),
        endpoints: {
            user: '/api/v1/user',
            image: '/api/v1/image',
            gallery: '/api/v1/gallery',
            cloudinary: '/api/v1/cloudinary'
        }
    });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path.join(__dirname, '..', 'client', 'dist');

    // Serve static files from React build
    app.use(express.static(frontendBuildPath, {
        maxAge: '1y',
        etag: false,
        index: false
    }));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        // Don't serve API routes through React
        if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
            return res.status(404).json({ error: 'API route not found' });
        }

        res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
} else {
    // Development route for testing
    app.get('/', (req, res) => {
        res.json({
            message: '🛠️ Imagify AI Development Server',
            documentation: 'https://github.com/your-username/imagify-ai',
            endpoints: {
                health: '/health',
                status: '/api/status',
                api: '/api/v1'
            },
            environment: 'development'
        });
    });
}

// 404 Handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        path: req.originalUrl,
        method: req.method,
        availableEndpoints: {
            user: '/api/v1/user',
            image: '/api/v1/image',
            gallery: '/api/v1/gallery',
            cloudinary: '/api/v1/cloudinary'
        }
    });
});

// Global Error Handler
app.use((error, req, res, next) => {
    console.error('💥 Global Error Handler:', error);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: Object.values(error.errors).map(e => e.message)
        });
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
            error: 'Duplicate Entry',
            message: `${field} already exists`
        });
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid Token',
            message: 'Please provide a valid authentication token'
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token Expired',
            message: 'Your session has expired. Please login again.'
        });
    }

    // Rate limit error
    if (error.status === 429) {
        return res.status(429).json({
            error: 'Too Many Requests',
            message: 'You have made too many requests. Please try again later.',
            retryAfter: error.retryAfter
        });
    }

    // Default error
    const statusCode = error.status || error.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Something went wrong on our end. Please try again later.'
        : error.message;

    res.status(statusCode).json({
        error: 'Internal Server Error',
        message: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Received SIGINT. Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('🛑 Received SIGTERM. Shutting down gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
    process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Promise Rejection at:', promise, 'reason:', reason);
    // Close server & exit process
    process.exit(1);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    🚀 Imagify AI Server Started!
    📍 Port: ${PORT}
    🌍 Environment: ${process.env.NODE_ENV || 'development'}
    🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}
    ⏰ Started at: ${new Date().toISOString()}
    
    📊 Health Check: http://localhost:${PORT}/health
    📋 API Status: http://localhost:${PORT}/api/status
    `);
});

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        process.exit(1);
    } else {
        console.error('💥 Server error:', error);
        process.exit(1);
    }
});

export default app;