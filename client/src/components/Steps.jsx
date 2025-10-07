import React, { useState } from "react";
import { stepsData } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";

const Steps = () => {
  const [hoveredStep, setHoveredStep] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 360,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-purple-50/30 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 border border-gray-200 shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            <span className="text-purple-600 font-semibold text-sm">
              Simple & Powerful
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Create Magic in 3 Simple Steps
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Transform your imagination into stunning AI-generated artwork with
            our intuitive process
          </motion.p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          {stepsData.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredStep(index)}
              onHoverEnd={() => setHoveredStep(null)}
              className="relative group"
            >
              {/* Step Card */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                  {index + 1}
                </div>

                {/* Icon Container */}
                <motion.div
                  variants={iconVariants}
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${
                    step.color || "bg-gradient-to-r from-purple-500 to-blue-500"
                  }`}
                >
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="w-10 h-10 filter brightness-0 invert"
                  />
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <motion.h3
                    className="text-2xl font-bold text-gray-800 mb-4 leading-tight"
                    whileHover={{
                      background:
                        step.color ||
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      transition: { duration: 0.3 },
                    }}
                  >
                    {step.title}
                  </motion.h3>

                  <motion.p
                    className="text-gray-600 leading-relaxed mb-6"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {step.description}
                  </motion.p>
                </div>

                {/* Tips Section */}
                {step.tips && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: hoveredStep === index ? 1 : 0,
                      height: hoveredStep === index ? "auto" : 0,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>💡</span>
                        Pro Tips:
                      </h4>
                      <ul className="space-y-1">
                        {step.tips.map((tip, tipIndex) => (
                          <li
                            key={tipIndex}
                            className="text-sm text-gray-600 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* Hover Gradient Overlay */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${
                    step.color || "from-purple-500/5 to-blue-500/5"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                ></div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />
              </div>

              {/* Connecting Line (for desktop) */}
              {index < stepsData.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transform -translate-y-1/2 z-0">
                  <motion.div
                    className="w-3 h-3 bg-blue-500 rounded-full absolute -top-1 -right-1"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Creating?
            </h3>
            <p className="text-purple-100 mb-6 text-lg">
              Join thousands of creators who are already transforming their
              ideas into stunning AI art
            </p>
            <motion.button
              className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Creating Free 🚀
            </motion.button>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <div className="flex items-center gap-2">
            {stepsData.map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  hoveredStep !== null && hoveredStep >= index
                    ? "bg-purple-500 scale-125"
                    : "bg-gray-300"
                }`}
                animate={{
                  scale: hoveredStep === index ? [1, 1.5, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: hoveredStep === index ? Infinity : 0,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Steps;
