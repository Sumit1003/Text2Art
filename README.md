<div align="center">

# ✨ 🎨 Text2Art - AI-Powered Image Generation Platform ✨

> 🎨 Transform your text into stunning AI-generated artwork with Text2Art. A full-stack MERN application that leverages artificial intelligence to create unique visual content from textual descriptions.

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=20232A)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white&labelColor=20232A)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0.15-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white&labelColor=20232A)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express-4.18.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
---

</div>

## ✨ Features
**🖼️ AI Image Generation**

1. Text-to-Image Conversion: Generate images from text prompts.
2. Multiple Art Styles: Various artistic styles and filters.
3. High-Resolution Output: Download images in high quality.
4. Real-time Processing: Watch your creations come to life.

**👤 User Management**
1. User Registration & Authentication: Secure JWT-based auth.
2. Personal Dashboard: Manage your generated images.
3. Profile Management: Update user preferences and settings.
4. Generation History: Track all your created artworks.

**🎨 Advanced Features**
1. Image Gallery: Browse community creations.
2. Image Editing Tools: Basic editing capabilities.
3. Batch Processing: Generate multiple images at once.
4. Style Transfer: Apply different artistic styles.

**💰 Pricing Tiers**
1. Free Tier: Limited generations with watermark.
2. Premium Tier: Unlimited HD generations.
3. Enterprise Tier: Commercial usage rights.

## 🚀 Live Demo
- Frontend:    `https://text2art1.onrender.com`

- Backend API: `https://text2art.onrender.com`

<div align="left">

### 🛠️ Technology Stack
## Frontend
1. React 18 - Modern UI library
2. Vite - Fast build tool and dev server
3. Tailwind CSS - Utility-first CSS framework
4. React Router - Client-side routing
5. React Toastify - Notifications and alerts
6. Context API - State management

### Backend
1. Node.js - Runtime environment
2. Express.js - Web application framework
3. MongoDB - NoSQL database
4. Mongoose - MongoDB object modeling
5. JWT - JSON Web Tokens for authentication
6. bcryptjs - Password hashing

### External Services
1. Cloudinary - Image storage and CDN
2. AI Model APIs - For image generation
3. Render - Cloud deployment platform

### Security & Performance
**Helmet.js - Security headers**
1. Express Rate Limit - API rate limiting
2. CORS - Cross-origin resource sharing
3. Compression - Response compression

### 📦 Installation
## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- AI API keys (OpenAI, Stability AI, etc.)

</div>

### 1. Clone the Repository

```bash
git clone https://github.com/sumit1003/Text2Art.git
cd Text2Art
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file in the server directory
touch .env

# Add the following environment variables to .env:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
AI_API_KEY=your_ai_service_key
PORT=5000

# Start the server
npm run server
```

3. Frontend Setup

```bash
# Navigate to client directory
cd server

# Install dependencies
npm install

# Create .env file in the server directory
touch .env

# Add the following environment variables to .env:
VITE_API_BASE_URL=http://localhost:5000
```

4. Run the Application

```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from client directory, new terminal)
npm run dev
```

### The application will be available at:

- Frontend: `http://localhost:3000`

- Backend : `http://localhost:5000`


### 🏗️ Project Structure

```bash
Text2Art/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   ├── public/             # Static assets
│   └── vite.config.js      # Vite configuration
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   └── server.js           # Server entry point
└── README.md
```

> **Important Notes**:
>
> - Never commit your `.env` files to version control
> - Make sure to replace the example values with your actual configuration
> - The CLIPDROP_API key can be obtained from [ClipDrop API](https://clipdrop.co/apis)
> - Keep your JWT_SECRET secure and use a strong random string


### 🔧 API Endpoints
**Authentication**
- POST /api/user/register - User registration
- POST /api/user/login - User login
- GET /api/user/profile - Get user profile
- PUT /api/user/profile - Update user profile

**Image Generation**
- POST /api/image/generate - Generate image from text
- GET /api/image/:id - Get specific image
- GET /api/image/user/:userId - Get user's images
- DELETE /api/image/:id - Delete image

**Gallery**
- GET /api/gallery - Browse public gallery
- GET /api/gallery/featured - Get featured images

**Utility**
-GET /health - Health check
-GET /api/status - API status


### 🎯 Usage
**Generating Images**
1. Create an account or login
2. Navigate to the Create page
3. Enter your text prompt describing the image you want
4. Select art style and parameters
5. Click Generate and wait for the AI to create your artwork
6. Download or share your generated image


### Managing Your Gallery
- View your generation history in the Dashboard
- Organize images into collections
- Share images to the public gallery
- Download high-resolution versions

### 🔒 Security Features
- JWT Authentication - Secure user sessions
- Password Hashing - bcrypt for secure password storage
- Rate Limiting - Prevent API abuse
- CORS Protection - Configured for specific origins
- Helmet.js - Security headers
- Input Validation - Server-side validation

### 🚀 Deployment
- The application is configured for deployment on Render.com:

**Backend Deployment**
- Build Command: npm install
- Start Command: npm start
- Environment: Node.js

**Frontend Deployment**
- Build Command: npm run build
- Publish Directory: dist
- Environment: Static site

## 🛠️ Tech Stack

<div align="center">

### Frontend

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0.15-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-20.0.0-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.0-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0.0-47A248?style=flat-square&logo=mongodb&logoColor=white)

</div>

## 🤝 Contributing

<div align="center">

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

</div>

### Development Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

</div>

### 📞 Support
- If you have any questions or need help with the project:
- Create an Issue: GitHub Issues
- Email: [Your Email]
- Documentation: Check the Wiki for detailed guides


<div align="center">

### Made with ❤️ by [SUMIT](https://github.com/Sumit1003)
[![GitHub Follow](https://img.shields.io/github/followers/Sumit1003?label=Follow%20Me&style=social)](https://github.com/Sumit1003)
> Transforming imagination into reality, one pixel at a time.

</div>
