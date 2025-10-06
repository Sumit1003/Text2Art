import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: "🎨",
      title: "AI-Powered Art Generation",
      description:
        "Create stunning artwork with advanced AI models. Transform your ideas into visual masterpieces with just a text prompt.",
      details: [
        "Multiple art styles",
        "High-resolution output",
        "Fast generation",
      ],
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Generate beautiful images in seconds, not hours. Our optimized AI delivers results when you need them.",
      details: [
        "30-second generation",
        "Real-time preview",
        "Batch processing",
      ],
    },
    {
      icon: "🎭",
      title: "Multiple Art Styles",
      description:
        "Choose from various artistic styles including realistic, anime, fantasy, abstract, and more.",
      details: ["10+ art styles", "Style mixing", "Custom parameters"],
    },
    {
      icon: "💾",
      title: "Cloud Gallery",
      description:
        "All your creations are safely stored in the cloud. Access your gallery from any device, anywhere.",
      details: ["Unlimited storage", "Organized collections", "Easy sharing"],
    },
    {
      icon: "🔒",
      title: "Privacy First",
      description:
        "Your prompts and generated images are private by default. Full control over your creative work.",
      details: ["Private gallery", "Secure storage", "Data encryption"],
    },
    {
      icon: "🚀",
      title: "Easy to Use",
      description:
        "No technical skills required. Simple interface that lets you focus on creativity, not complexity.",
      details: ["Intuitive design", "One-click generation", "Mobile friendly"],
    },
  ];

  const stats = [
    { number: "10K+", label: "Images Generated" },
    { number: "500+", label: "Happy Users" },
    { number: "50+", label: "Art Styles" },
    { number: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Powerful Features for{" "}
            <span className="text-blue-600">Creative Minds</span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover everything you need to bring your imagination to life with
            our advanced AI image generation platform.
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li
                    key={detailIndex}
                    className="flex items-center text-sm text-gray-500"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Create Magic?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already transforming their ideas
            into stunning visual art with Imagify.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Creating Free
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "How does AI image generation work?",
                answer:
                  "Our AI analyzes your text prompt and generates unique images using advanced machine learning models trained on millions of artworks.",
              },
              {
                question: "What image formats are supported?",
                answer:
                  "We generate high-quality PNG images with transparent backgrounds, perfect for both web and print use.",
              },
              {
                question: "Can I use the images commercially?",
                answer:
                  "Yes! All images you generate are yours to use for personal and commercial projects.",
              },
              {
                question: "How long does image generation take?",
                answer:
                  "Typically 30-60 seconds depending on complexity. We're constantly optimizing for faster results.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <h3 className="font-semibold text-gray-800 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
