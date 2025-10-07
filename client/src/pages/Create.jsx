import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const { isAuthenticated, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("generate");

  const features = [
    {
      id: "upload",
      title: "📤 Upload & Process",
      description: "Upload your own images and apply AI enhancements",
      icon: "📁",
      color: "orange",
      action: () => navigate("/upload"),
      premium: false,
    },
    {
      id: "generate",
      title: "🎨 Generate AI Images",
      description: "Create stunning images from text prompts using AI",
      icon: "✨",
      color: "purple",
      action: () => navigate("/result"),
      premium: false,
    },
    {
      id: "enhance",
      title: "🔧 Image Enhancement",
      description: "Upscale, enhance quality, and optimize your images",
      icon: "⚡",
      color: "blue",
      action: () => navigate("/upload"),
      premium: false,
    },
    {
      id: "background",
      title: "🎯 Remove Background",
      description: "AI-powered background removal in seconds",
      icon: "✂️",
      color: "green",
      action: () => navigate("/upload"),
      premium: false,
    },
    {
      id: "batch",
      title: "🔄 Batch Processing",
      description: "Process multiple images at once",
      icon: "📊",
      color: "red",
      action: () => handleFeatureClick("batch"),
      premium: true,
    },
    {
      id: "styles",
      title: "🎭 Style Transfer",
      description: "Apply artistic styles to your images",
      icon: "🖼️",
      color: "pink",
      action: () => handleFeatureClick("styles"),
      premium: true,
    },
  ];

  const handleFeatureClick = (featureId) => {
    if (!isAuthenticated) {
      toast.error("Please login to access this feature");
      setShowLogin(true);
      return;
    }

    switch (featureId) {
      case "enhance":
        navigate("/result?action=enhance");
        break;
      case "background":
        navigate("/result?action=remove-bg");
        break;
      case "upload":
        toast.info("Upload feature coming soon!");
        break;
      case "batch":
        toast.info("Batch processing coming soon!");
        break;
      case "styles":
        toast.info("Style transfer coming soon!");
        break;
      default:
        navigate("/result");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Create Magic ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your creative tool and transform your ideas into stunning
            visuals with AI-powered features
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative bg-white rounded-2xl p-6 shadow-lg border-2 cursor-pointer
                transform transition-all duration-300 group
                ${feature.premium ? "border-yellow-400" : "border-transparent"}
                hover:shadow-xl
              `}
              onClick={feature.action}
            >
              {/* Premium Badge */}
              {feature.premium && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  PRO
                </div>
              )}

              {/* Icon */}
              <div
                className={`text-4xl mb-4 text-${feature.color}-500 group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>

              {/* Action Button */}
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-white bg-${feature.color}-500 hover:bg-${feature.color}-600 transition-colors`}
              >
                <span>Get Started</span>
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              {/* Hover Effect */}
              <div
                className={`absolute inset-0 rounded-2xl bg-${feature.color}-500 opacity-0 group-hover:opacity-5 transition-opacity`}
              ></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🚀 Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/result")}
              className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
            >
              <span className="text-2xl mb-2">🎨</span>
              <span className="font-semibold text-gray-800">Generate</span>
              <span className="text-sm text-gray-600">New Image</span>
            </button>

            <button
              onClick={() => handleFeatureClick("enhance")}
              className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
            >
              <span className="text-2xl mb-2">⚡</span>
              <span className="font-semibold text-gray-800">Enhance</span>
              <span className="text-sm text-gray-600">Existing Image</span>
            </button>

            <button
              onClick={() => handleFeatureClick("background")}
              className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
            >
              <span className="text-2xl mb-2">✂️</span>
              <span className="font-semibold text-gray-800">Remove BG</span>
              <span className="text-sm text-gray-600">Background</span>
            </button>

            <button
              onClick={() => navigate("/gallery")}
              className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group"
            >
              <span className="text-2xl mb-2">📚</span>
              <span className="font-semibold text-gray-800">Gallery</span>
              <span className="text-sm text-gray-600">My Creations</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-purple-600">50K+</div>
            <div className="text-gray-600">Images Generated</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-blue-600">10K+</div>
            <div className="text-gray-600">Happy Users</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-green-600">99%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-orange-600">24/7</div>
            <div className="text-gray-600">AI Processing</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Create;
