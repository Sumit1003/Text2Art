import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: "🎨",
      title: "AI Image Generation",
      description:
        "Create stunning artwork from text prompts using advanced AI models. Transform ideas into visual masterpieces instantly.",
      details: [
        "Multiple art styles",
        "High-resolution output",
        "Fast 30-second generation",
        "Batch processing",
      ],
      action: "/result",
      color: "purple",
    },
    {
      icon: "✨",
      title: "AI Image Enhancement",
      description:
        "Improve your existing images with AI-powered enhancement. Boost quality, colors, and details automatically.",
      details: [
        "Quality improvement",
        "Color enhancement",
        "Detail sharpening",
        "Auto-correction",
      ],
      action: "/upload?action=enhance",
      color: "blue",
    },
    {
      icon: "🎯",
      title: "Background Removal",
      description:
        "Remove backgrounds from any image with AI precision. Perfect for product photos, portraits, and creative projects.",
      details: [
        "One-click removal",
        "High accuracy",
        "Transparent PNG output",
        "Batch processing",
      ],
      action: "/upload?action=remove-bg",
      color: "green",
    },
    {
      icon: "🔍",
      title: "Image Upscaling",
      description:
        "Increase image resolution without losing quality. Make your images sharper and more detailed with AI upscaling.",
      details: [
        "2x-4x upscaling",
        "Quality preservation",
        "Noise reduction",
        "Detail enhancement",
      ],
      action: "/upload?action=upscale",
      color: "orange",
    },
    {
      icon: "⚡",
      title: "Image Optimization",
      description:
        "Optimize images for web and mobile with intelligent compression. Reduce file size while maintaining quality.",
      details: [
        "Smart compression",
        "Format conversion",
        "Quality optimization",
        "Fast delivery",
      ],
      action: "/upload?action=optimize",
      color: "red",
    },
    {
      icon: "📤",
      title: "Upload & Process",
      description:
        "Upload your own images and apply multiple AI enhancements. Support for all common image formats.",
      details: [
        "Multiple formats",
        "Batch upload",
        "Real-time preview",
        "Cloud storage",
      ],
      action: "/upload",
      color: "teal",
    },
  ];

  const advancedFeatures = [
    {
      icon: "🔄",
      title: "Batch Processing",
      description:
        "Process multiple images at once with our batch processing system. Save time on large projects.",
      status: "premium",
    },
    {
      icon: "🎭",
      title: "Style Transfer",
      description:
        "Apply artistic styles to your images. Transform photos into paintings with various art styles.",
      status: "premium",
    },
    {
      icon: "🤖",
      title: "AI Face Enhancement",
      description:
        "Automatically enhance faces in portraits with AI. Improve skin, eyes, and overall portrait quality.",
      status: "coming-soon",
    },
    {
      icon: "🌅",
      title: "Background Replacement",
      description:
        "Replace backgrounds with AI-generated scenes or your own images. Create professional composites.",
      status: "coming-soon",
    },
  ];

  const stats = [
    { number: "50K+", label: "Images Generated", icon: "🖼️" },
    { number: "10K+", label: "Happy Users", icon: "😊" },
    { number: "99.9%", label: "Uptime", icon: "⚡" },
    { number: "24/7", label: "AI Processing", icon: "🤖" },
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Choose Your Method",
      description: "Generate new images or upload existing ones",
      options: ["Text-to-Image", "Image Upload"],
      icon: "🚀",
    },
    {
      step: "2",
      title: "Apply AI Magic",
      description: "Select from various AI enhancement tools",
      options: ["Enhance", "Remove BG", "Upscale", "Optimize"],
      icon: "✨",
    },
    {
      step: "3",
      title: "Download & Share",
      description: "Get high-quality results instantly",
      options: ["Multiple Formats", "High Quality", "Fast Download"],
      icon: "💾",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Powerful AI Tools for{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Every Creator
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From AI image generation to professional photo editing - everything
            you need to bring your creative vision to life.
          </motion.p>

          {/* Quick Action Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          ></motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Workflow Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-16 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            🎯 How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {step.step}
                </div>
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <div className="space-y-2">
                  {step.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className="text-sm text-gray-500 bg-gray-50 rounded-lg py-1 px-3"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            ✨ Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {feature.details.map((detail, detailIndex) => (
                      <li
                        key={detailIndex}
                        className="flex items-center text-sm text-gray-500"
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={feature.action}
                    className={`inline-flex items-center px-4 py-2 bg-${feature.color}-500 text-white rounded-lg font-medium hover:bg-${feature.color}-600 transition-colors group`}
                  >
                    Try Now
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
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Advanced Features */}
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 mb-16 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            🚀 Advanced Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          feature.status === "premium"
                            ? "bg-yellow-500 text-yellow-900"
                            : "bg-blue-500 text-blue-900"
                        }`}
                      >
                        {feature.status === "premium"
                          ? "PREMIUM"
                          : "COMING SOON"}
                      </span>
                    </div>
                    <p className="text-white/80 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center border border-gray-100 mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ready to Transform Your Creativity?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using Text2Art to
            generate, enhance, and transform their images with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/result"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all hover:scale-105"
            >
              🎨 Start Creating Free
            </Link>
            <Link
              to="/upload"
              className="border-2 border-purple-500 text-purple-600 px-8 py-4 rounded-2xl font-semibold hover:bg-purple-50 transition-all hover:scale-105"
            >
              📤 Try Image Enhancement
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
