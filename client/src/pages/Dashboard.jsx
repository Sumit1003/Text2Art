import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, token, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [isNameHovered, setIsNameHovered] = useState(false);
  const [stats, setStats] = useState({
    credits: 0,
    imagesGenerated: 0,
    favoriteStyles: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError("Authentication required. Please login.");
        setIsLoading(false);
        navigate("/");
        return;
      }

      try {
        console.log(
          "Fetching dashboard data with token:",
          token ? "Yes" : "No"
        );

        const [creditsResponse, generationsResponse] = await Promise.all([
          axios.get(`${backendUrl}/api/user/credits`, {
            headers: {
              token,
              "Content-Type": "application/json",
            },
          }),
          axios.get(`${backendUrl}/api/image/user-generations`, {
            headers: {
              token,
              "Content-Type": "application/json",
            },
          }),
        ]);

        console.log("Credits response:", creditsResponse.data);
        console.log("Generations response:", generationsResponse.data);

        if (creditsResponse.data.success && generationsResponse.data.success) {
          setStats({
            credits: creditsResponse.data.credits || 0,
            imagesGenerated: generationsResponse.data.totalGenerations || 0,
            favoriteStyles: generationsResponse.data.uniqueStyles || 0,
          });
          setError(null);
        } else {
          const errorMessage =
            creditsResponse.data.message ||
            generationsResponse.data.message ||
            "Failed to fetch dashboard data";
          console.error("Dashboard data error:", errorMessage);
          setError(errorMessage);
          if (
            errorMessage.includes("Authentication") ||
            errorMessage.includes("login")
          ) {
            navigate("/");
          }
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to load dashboard data";
        setError(errorMessage);
        if (
          error.response?.status === 401 ||
          errorMessage.includes("Authentication") ||
          errorMessage.includes("login")
        ) {
          navigate("/");
        }
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, backendUrl, navigate]);

  const handleAction = (action) => {
    switch (action) {
      case "generate":
        navigate("/result");
        break;
      case "upload":
        navigate("/upload");
        break;
      case "create":
        navigate("/create");
        break;
      case "gallery":
        navigate("/gallery");
        break;
      default:
        navigate("/result");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your creative dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      id: "generate",
      title: "🎨 Generate AI Images",
      description: "Create from text prompts",
      color: "purple",
      icon: "✨",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "upload",
      title: "📤 Upload & Enhance",
      description: "Process your own images",
      color: "blue",
      icon: "⚡",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "create",
      title: "🚀 All Features",
      description: "Explore everything",
      color: "green",
      icon: "🛠️",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "gallery",
      title: "🖼️ My Gallery",
      description: "View creations",
      color: "orange",
      icon: "📚",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const aiFeatures = [
    {
      title: "✨ Image Enhancement",
      description: "Improve quality, colors, and details of your images",
      action: () => navigate("/upload?action=enhance"),
      icon: "🌟",
      color: "purple",
    },
    {
      title: "🎯 Background Removal",
      description: "Remove backgrounds automatically with AI",
      action: () => navigate("/upload?action=remove-bg"),
      icon: "✂️",
      color: "green",
    },
    {
      title: "🔍 Image Upscaling",
      description: "Increase resolution and quality",
      action: () => navigate("/upload?action=upscale"),
      icon: "📈",
      color: "blue",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section with Enhanced Stats */}
        <motion.div
          className="bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 rounded-2xl shadow-xl p-8 text-white mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="relative z-10">
            <motion.h1
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Welcome back,{" "}
              </span>
              <motion.span
                className="inline-block cursor-pointer bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent font-bold"
                whileHover={{
                  scale: 1.05,
                  textShadow: "0 0 20px rgba(255,255,255,0.5)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {user?.name}
              </motion.span>
              <motion.span
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="ml-2"
              >
                👋
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl opacity-90 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Ready to create something amazing today?
            </motion.p>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Available Credits",
                  value: stats.credits,
                  icon: "⭐",
                  color: "from-yellow-400 to-orange-400",
                },
                {
                  label: "Images Created",
                  value: stats.imagesGenerated,
                  icon: "🖼️",
                  color: "from-blue-400 to-cyan-400",
                },
                {
                  label: "Styles Explored",
                  value: stats.favoriteStyles,
                  icon: "🎨",
                  color: "from-purple-400 to-pink-400",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    transition: { type: "spring", stiffness: 300, damping: 15 },
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm opacity-75">{stat.label}</p>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className={`bg-gradient-to-r ${action.gradient} text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group overflow-hidden relative`}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 },
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* AI Features Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ✨ AI Image Tools
          </h2>
          <p className="text-gray-600 mb-6">
            Enhance your existing images with powerful AI features
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-all duration-300 cursor-pointer group hover:shadow-lg"
                onClick={feature.action}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div
                  className={`text-3xl mb-4 text-${feature.color}-500 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-purple-600 group-hover:text-purple-700 font-medium text-sm">
                  Try Now
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Tutorial */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              🎯 Quick Start Guide
            </h3>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Choose Your Method",
                  description: "Generate new images or upload existing ones",
                  icon: "🚀",
                },
                {
                  step: "2",
                  title: "Apply AI Magic",
                  description:
                    "Use enhancement, background removal, or upscaling",
                  icon: "✨",
                },
                {
                  step: "3",
                  title: "Download & Share",
                  description: "Get your enhanced images in high quality",
                  icon: "💾",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{item.icon}</span>
                      <h4 className="font-semibold text-gray-800">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Resources & Help */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              💡 Resources & Help
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: "📚 Feature Documentation",
                  description: "Learn about all AI tools and features",
                  action: () => navigate("/features"),
                  color: "blue",
                },
                {
                  title: "🔄 Batch Processing Guide",
                  description: "Process multiple images efficiently",
                  action: () => toast.info("Batch processing coming soon!"),
                  color: "green",
                },
                {
                  title: "⭐ Premium Features",
                  description: "Unlock advanced AI capabilities",
                  action: () => navigate("/buy"),
                  color: "purple",
                },
                {
                  title: "💬 Support & Community",
                  description: "Get help and share creations",
                  action: () => toast.info("Community features coming soon!"),
                  color: "orange",
                },
              ].map((resource, index) => (
                <motion.button
                  key={resource.title}
                  onClick={resource.action}
                  className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4
                        className={`font-semibold text-${resource.color}-600 group-hover:text-${resource.color}-700`}
                      >
                        {resource.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {resource.description}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
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
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
