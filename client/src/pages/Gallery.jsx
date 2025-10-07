import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const Gallery = () => {
  const { user, token, backendUrl, isAuthenticated } = useContext(AppContext);
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEn0T8PkCGqiIvRhmiqsJU8i7BltVVqQlunQ&s",
      prompt: "A beautiful landscape with mountains and lakes",
      style: "realistic",
      createdAt: new Date(),
    },
    {
      _id: "2",
      imageUrl:
        "https://img.freepik.com/premium-photo/cyberpunk-city-street-night-with-neon-lights-futuristic-aesthetic_1287933-992.jpg",
      prompt: "Cyberpunk city at night with neon lights",
      style: "fantasy",
      createdAt: new Date(Date.now() - 86400000),
    },
  ];

  const displayGenerations =
    generations.length > 0 ? generations : sampleGenerations;

  const filteredGenerations = displayGenerations.filter((gen) => {
    if (filter === "all") return true;
    return gen.style === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your Gallery
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isAuthenticated
              ? "Explore your AI-generated masterpieces"
              : "Sign in to view your creations"}
          </motion.p>
        </div>

        {/* Filter Tabs */}
        {isAuthenticated && displayGenerations.length > 0 && (
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {["all", "realistic", "anime", "fantasy", "abstract"].map(
              (filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-6 py-2 rounded-full capitalize transition-all ${
                    filter === filterType
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filterType}
                </button>
              )
            )}
          </motion.div>
        )}

        {/* Gallery Grid */}
        {isAuthenticated ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {filteredGenerations.length > 0 ? (
              filteredGenerations.map((generation, index) => (
                <motion.div
                  key={generation._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={generation.imageUrl}
                      alt={generation.prompt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x400?text=Image+Not+Found";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {generation.prompt}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        {new Date(generation.createdAt).toLocaleDateString()}
                      </span>
                      <span className="capitalize">
                        {generation.style || "general"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No images yet
                </h3>
                <p className="text-gray-500 mb-4">
                  {filter === "all"
                    ? "Start creating amazing AI art to see them here!"
                    : `No ${filter} style images found`}
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Sign in to view your gallery
            </h3>
            <p className="text-gray-500 mb-6">
              Login to see all your AI-generated creations in one place
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
