import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Gallery = () => {
  const { user, token, backendUrl, isAuthenticated } = useContext(AppContext);
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenerations = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching gallery data...");
        const response = await axios.get(
          `${backendUrl}/api/image/user-generations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Gallery response:", response.data);

        if (response.data.success) {
          // Normalize image URLs — handle both Cloudinary and local paths
          const formatted = (response.data.recentGenerations || []).map(
            (gen) => {
              if (gen.imageUrl && !gen.imageUrl.startsWith("http")) {
                // Prepend backend URL for local images
                gen.imageUrl = `${backendUrl}${gen.imageUrl}`;
              }
              return gen;
            }
          );

          setGenerations(formatted);
        } else {
          toast.error(response.data.message || "Failed to load gallery");
        }
      } catch (error) {
        console.error("Gallery fetch error:", error);
        toast.error("Error loading gallery");
      } finally {
        setLoading(false);
      }
    };

    fetchGenerations();
  }, [isAuthenticated, token, backendUrl]);

  // If no data, show sample placeholders
  const sampleGenerations = [
    {
      _id: "1",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      prompt: "A beautiful landscape with mountains and lakes at sunset",
      style: "realistic",
      createdAt: new Date(),
      type: "generated",
    },
    {
      _id: "2",
      imageUrl:
        "https://img.freepik.com/premium-photo/futuristic-cyberpunk-city-night-with-neon-lights-flying-cars_1022970-50926.jpg",
      prompt: "Cyberpunk city at night with neon lights and flying cars",
      style: "fantasy",
      createdAt: new Date(Date.now() - 86400000),
      type: "generated",
    },
    {
      _id: "3",
      imageUrl:
        "https://media.easy-peasy.ai/27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e/87cd3f9c-fa43-4c00-9900-d8e641522d2f.png",
      prompt: "Portrait of a woman with enhanced colors and details",
      style: "enhanced",
      createdAt: new Date(Date.now() - 172800000),
      type: "processed",
    },
    {
      _id: "4",
      imageUrl:
        "https://img.freepik.com/premium-photo/abstract-geometric-pattern-with-vibrant-colors-intricate-lines_1353433-1862.jpg?w=360",
      prompt: "Abstract geometric patterns with vibrant gradient colors",
      style: "abstract",
      createdAt: new Date(Date.now() - 259200000),
      type: "generated",
    },
  ];

  const displayGenerations =
    generations.length > 0 ? generations : sampleGenerations;

  // Filter and search logic
  const filteredGenerations = displayGenerations.filter((gen) => {
    const matchesFilter = filter === "all" || gen.style === filter;
    const matchesSearch = gen.prompt
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const downloadImage = async (imageUrl, prompt) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `imagify-${prompt.slice(0, 20)}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const getStyleColor = (style) => {
    const colors = {
      realistic: "bg-blue-100 text-blue-800",
      fantasy: "bg-purple-100 text-purple-800",
      anime: "bg-pink-100 text-pink-800",
      abstract: "bg-orange-100 text-orange-800",
      enhanced: "bg-green-100 text-green-800",
      default: "bg-gray-100 text-gray-800",
    };
    return colors[style] || colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your creative gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Your Creative Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            {isAuthenticated
              ? "All your AI-generated and enhanced masterpieces in one place"
              : "Sign in to view and manage your creations"}
          </p>

          {/* Quick Actions */}
          {isAuthenticated && (
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
            </motion.div>
          )}
        </motion.div>

        {/* Controls */}
        {isAuthenticated && displayGenerations.length > 0 && (
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 w-full lg:max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search your creations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm"
                      : "hover:bg-white/50"
                  }`}
                >
                  ⏹️
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm"
                      : "hover:bg-white/50"
                  }`}
                >
                  📄
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  "all",
                  "realistic",
                  "fantasy",
                  "anime",
                  "abstract",
                  "enhanced",
                ].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-2 rounded-full capitalize text-sm font-medium transition-all ${
                      filter === filterType
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filterType}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Gallery Content */}
        {isAuthenticated ? (
          <AnimatePresence>
            {filteredGenerations.length > 0 ? (
              viewMode === "grid" ? (
                // Grid View
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  layout
                >
                  {filteredGenerations.map((generation, index) => (
                    <motion.div
                      key={generation._id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      layout
                    >
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={generation.imageUrl}
                          alt={generation.prompt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x400?text=Image+Not+Found";
                          }}
                        />

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedImage(generation)}
                            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() =>
                              downloadImage(
                                generation.imageUrl,
                                generation.prompt
                              )
                            }
                            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                          >
                            💾
                          </button>
                          {generation.type === "processed" && (
                            <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                              Enhanced
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3 font-medium">
                          {generation.prompt}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {new Date(
                              generation.createdAt
                            ).toLocaleDateString()}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStyleColor(
                              generation.style
                            )}`}
                          >
                            {generation.style || "general"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                // List View
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  layout
                >
                  {filteredGenerations.map((generation, index) => (
                    <motion.div
                      key={generation._id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                      layout
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={generation.imageUrl}
                            alt={generation.prompt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-medium line-clamp-2 mb-2">
                            {generation.prompt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              {new Date(
                                generation.createdAt
                              ).toLocaleDateString()}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStyleColor(
                                generation.style
                              )}`}
                            >
                              {generation.style || "general"}
                            </span>
                            {generation.type === "processed" && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                AI Enhanced
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => setSelectedImage(generation)}
                            className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            👁️ View
                          </button>
                          <button
                            onClick={() =>
                              downloadImage(
                                generation.imageUrl,
                                generation.prompt
                              )
                            }
                            className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            💾 Download
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-8xl mb-6">🎨</div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                  {searchTerm
                    ? "No matching creations found"
                    : "Your gallery is empty"}
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {searchTerm
                    ? "Try adjusting your search terms or filters"
                    : "Start creating amazing AI art to see them here!"}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate("/result")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all"
                  >
                    🎨 Generate Images
                  </button>
                  <button
                    onClick={() => navigate("/upload")}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all"
                  >
                    📤 Upload Images
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-8xl mb-6">🔒</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              Sign in to view your gallery
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Login to see all your AI-generated and enhanced creations in one
              beautiful gallery
            </p>
            <button
              onClick={() => navigate("/result")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all"
            >
              🚀 Start Creating
            </button>
          </motion.div>
        )}

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="relative">
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.prompt}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Prompt
                  </h3>
                  <p className="text-gray-600 mb-4">{selectedImage.prompt}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>
                        Created:{" "}
                        {new Date(selectedImage.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full ${getStyleColor(
                          selectedImage.style
                        )}`}
                      >
                        {selectedImage.style}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        downloadImage(
                          selectedImage.imageUrl,
                          selectedImage.prompt
                        )
                      }
                      className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 transition-colors"
                    >
                      💾 Download
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;
