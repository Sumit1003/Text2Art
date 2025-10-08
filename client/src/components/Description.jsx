import React, { useState } from "react";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";

function Description() {
  const [hoveredImage, setHoveredImage] = useState(null);

  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Generate high-quality images in seconds",
    },
    {
      icon: "🎨",
      title: "Multiple Styles",
      description: "Choose from various artistic styles and themes",
    },
    {
      icon: "🔄",
      title: "Unlimited Generations",
      description: "Create as many images as you want",
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Works perfectly on all devices",
    },
  ];

  const sampleImages = [
    assets.sample_img_1,
    assets.sample_img_2,
    assets.sample_img_3,
  ];

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div className="text-center mb-16" variants={textVariants}>
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-blue-600 font-semibold text-sm">
              AI-Powered Creativity
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent"
            variants={textVariants}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
          >
            Create Magic with
            <motion.span
              className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              AI Images
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={textVariants}
            whileHover={{
              color: "#6366f1",
              scale: 1.01,
            }}
            transition={{ duration: 0.2 }}
          >
            Transform your imagination into stunning visual art with our
            advanced AI technology.
            <span className="block text-purple-600 font-semibold mt-2">
              Describe it. Generate it. Love it.
            </span>
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images Section */}
          <div className="grid grid-cols-3 gap-4">
            {sampleImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Sample ${index + 1}`}
                  className="w-full h-auto rounded-lg object-cover transition-all duration-300 group-hover:shadow-lg"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-end justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-sm mb-2">AI Art</span>
                </div>
              </div>
            ))}
          </div>

          {/* Text Content */}
          <motion.div className="space-y-8" variants={textVariants}>
            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-2 gap-4 mt-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={featureVariants}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    backgroundColor: "rgba(179, 20, 20, 0.9)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <motion.span
                      className="text-2xl group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.span>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center"
        >
          {[
            { number: "10K+", label: "Images Generated" },
            { number: "2K+", label: "Happy Users" },
            { number: "99.9%", label: "Uptime" },
            { number: "24/7", label: "AI Processing" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm"
              whileHover={{
                y: -5,
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
            >
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Description;
