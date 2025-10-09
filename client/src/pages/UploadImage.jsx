import React, { useState, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UploadImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const { uploadImage, isAuthenticated, setShowLogin, credit } =
    useContext(AppContext);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, WEBP, GIF)");
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to upload images");
      setShowLogin(true);
      return;
    }

    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadImage(imagePreview);
      if (result) {
        setUploadedImageUrl(result.imageUrl);
        toast.success("🎉 Image uploaded successfully!");

        // Auto-select first available feature if none selected
        if (!selectedFeature) {
          const firstFeature = features.find((f) => f.requiresUpload);
          setSelectedFeature(firstFeature);
        }
      }
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const event = { target: { files: [file] } };
      handleFileSelect(event);
    }
  };

  const resetUpload = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setSelectedFeature(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const features = [
    {
      id: "generate",
      title: "🎨 Generate AI Image",
      description: "Create new images from text prompts",
      icon: "🪄",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-gradient-to-r from-pink-500 to-rose-500",
      requiresUpload: false,
      credits: 5,
      action: () => navigate("/result"),
      popular: true,
    },
    {
      id: "enhance",
      title: "✨ Enhance Image",
      description: "Improve quality, colors, and details with AI",
      icon: "⚡",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
      requiresUpload: true,
      credits: 2,
      action: (imageUrl) =>
        navigate("/process-image", { state: { imageUrl, feature: "enhance" } }),
    },
    {
      id: "remove-bg",
      title: "🎯 Remove Background",
      description: "AI-powered automatic background removal",
      icon: "✂️",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-r from-green-500 to-emerald-500",
      requiresUpload: true,
      credits: 3,
      action: (imageUrl) =>
        navigate("/process-image", {
          state: { imageUrl, feature: "remove-bg" },
        }),
      popular: true,
    },
    {
      id: "upscale",
      title: "🔍 Upscale Image",
      description: "Increase resolution up to 4x with AI",
      icon: "📈",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
      requiresUpload: true,
      credits: 2,
      action: (imageUrl) =>
        navigate("/process-image", { state: { imageUrl, feature: "upscale" } }),
    },
    {
      id: "optimize",
      title: "💫 Optimize Image",
      description: "Compress and optimize for web performance",
      icon: "🚀",
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-gradient-to-r from-orange-500 to-amber-500",
      requiresUpload: true,
      credits: 1,
      action: (imageUrl) =>
        navigate("/process-image", {
          state: { imageUrl, feature: "optimize" },
        }),
    },
  
  ];

  const handleFeatureClick = (feature) => {
    if (!isAuthenticated) {
      toast.error("Please login to use this feature");
      setShowLogin(true);
      return;
    }

    if (feature.requiresUpload && !uploadedImageUrl) {
      toast.error("Please upload an image first");
      return;
    }

    if (feature.credits > credit) {
      toast.error(
        `Insufficient credits. This feature requires ${feature.credits} credits.`
      );
      navigate("/pricing");
      return;
    }

    setSelectedFeature(feature);

    if (feature.action) {
      if (feature.requiresUpload) {
        feature.action(uploadedImageUrl);
      } else {
        feature.action();
      }
    }
  };

  const getFeatureStatus = (feature) => {
    if (!isAuthenticated) return "login-required";
    if (feature.requiresUpload && !uploadedImageUrl) return "upload-required";
    if (feature.credits > credit) return "credits-required";
    return "available";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            AI Image Studio 🚀
          </motion.h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload your images and transform them with powerful AI enhancements.
            From basic optimizations to magical transformations.
          </p>

          {/* Credit Display */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-gray-700">
                {credit} credits available
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200"
        >
          <h4 className="font-semibold text-blue-800 mb-3 text-lg flex items-center gap-">
            <span>💡</span>
            How it works:
          </h4>
          <div className="grid grid-cols-4 gap-4 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <span>Upload your image</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <span>Choose AI feature</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span>Process with AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </div>
              <span>Download result</span>
            </div>
          </div>
        </motion.div>


        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Upload Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <span className="text-3xl">📤</span>
                Upload Your Image
              </h2>
              <p className="text-gray-600 mb-6">
                Get started by uploading your image
              </p>

              {/* Upload Area */}
              <motion.div
                className={`relative border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group ${
                  dragActive
                    ? "border-purple-500 bg-purple-50 scale-105"
                    : selectedImage
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />

                <AnimatePresence>
                  {!selectedImage ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        📁
                      </motion.div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        {dragActive
                          ? "Drop your image here!"
                          : "Click to browse or drag & drop"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Supports JPG, PNG, WEBP, GIF • Max 10MB
                      </p>
                      <div className="mt-4 flex justify-center gap-2 text-xs text-gray-400">
                        <span>🖼️ Any image</span>
                        <span>•</span>
                        <span>⚡ Fast processing</span>
                        <span>•</span>
                        <span>🔒 Secure upload</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="text-4xl mb-4">✅</div>
                      <p className="text-lg font-semibold text-green-600 mb-2">
                        Image Selected!
                      </p>
                      <p className="text-gray-600 text-sm mb-2">
                        {selectedImage.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Drag active overlay */}
                {dragActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-purple-500 bg-opacity-10 rounded-2xl flex items-center justify-center"
                  >
                    <div className="text-purple-600 text-lg font-semibold">
                      Drop to upload
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <AnimatePresence>
                {selectedImage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 space-y-4"
                  >
                    {!uploadedImageUrl ? (
                      <motion.button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl relative overflow-hidden group"
                        whileHover={{ scale: uploading ? 1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative z-10 flex items-center justify-center gap-3">
                          {uploading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xl">🚀</span>
                              <span>Upload & Process Image</span>
                            </>
                          )}
                        </div>

                        {/* Button shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform"
                          initial={{ x: "-100%" }}
                          animate={{ x: uploading ? "100%" : "100%" }}
                          transition={{
                            duration: 1.5,
                            repeat: uploading ? Infinity : 0,
                          }}
                        />
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl text-center"
                      >
                        <div className="text-2xl mb-2">🎉</div>
                        <p className="text-green-800 font-semibold text-lg">
                          Upload Successful!
                        </p>
                        <p className="text-green-600 text-sm mt-1">
                          Your image is ready for AI transformation
                        </p>
                      </motion.div>
                    )}

                    <button
                      onClick={resetUpload}
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-all duration-300 border border-gray-200"
                    >
                      Choose Different Image
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Image Preview */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100"
                >
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                    <span>👁️</span>
                    Image Preview
                  </h3>
                  <div className="flex justify-center">
                    <motion.img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-64 object-cover rounded-2xl shadow-lg border border-gray-200"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="text-3xl">🛠️</span>
                  AI Features
                </h2>
                <div className="text-sm text-gray-500">
                  {features.length} tools available
                </div>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => {
                  const status = getFeatureStatus(feature);
                  const isDisabled = status !== "available";

                  return (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className={`
                        p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group relative overflow-hidden
                        ${
                          isDisabled
                            ? "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
                            : `border-gray-200 bg-white hover:shadow-xl hover:scale-105 ${
                                selectedFeature?.id === feature.id
                                  ? "ring-2 ring-purple-500 ring-opacity-50"
                                  : ""
                              }`
                        }
                      `}
                      onClick={() => !isDisabled && handleFeatureClick(feature)}
                      whileHover={!isDisabled ? { y: -2 } : {}}
                    >
                      {/* Background gradient on hover */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      ></div>

                      <div className="flex items-center space-x-4 relative z-10">
                        <div
                          className={`text-2xl p-3 rounded-xl ${feature.bgColor} text-white shadow-lg`}
                        >
                          {feature.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-800 text-lg truncate">
                              {feature.title}
                            </h3>
                            {feature.popular && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                                POPULAR
                              </span>
                            )}
                            {feature.premium && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                                PREMIUM
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {feature.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>⚡</span>
                              <span>
                                {feature.credits} credit
                                {feature.credits !== 1 ? "s" : ""}
                              </span>
                            </div>
                            {status === "credits-required" && (
                              <span className="text-xs text-red-500 font-medium">
                                Insufficient credits
                              </span>
                            )}
                            {status === "upload-required" && (
                              <span className="text-xs text-orange-500 font-medium">
                                Upload required
                              </span>
                            )}
                            {status === "login-required" && (
                              <span className="text-xs text-blue-500 font-medium">
                                Login required
                              </span>
                            )}
                          </div>
                        </div>
                        <motion.div
                          className={`text-2xl transition-transform ${
                            isDisabled
                              ? "text-gray-400"
                              : "text-gray-300 group-hover:text-gray-600"
                          }`}
                          whileHover={!isDisabled ? { x: 5 } : {}}
                        >
                          →
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
