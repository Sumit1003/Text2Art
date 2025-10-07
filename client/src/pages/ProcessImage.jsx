import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const ProcessImage = () => {
  const [processedImage, setProcessedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    removeBackground,
    enhanceImage,
    upscaleImage,
    optimizeImage,
    isAuthenticated,
  } = useContext(AppContext);

  const { imageUrl, feature } = location.state || {};

  useEffect(() => {
    if (!imageUrl || !feature) {
      toast.error("No image or feature selected");
      navigate("/upload");
      return;
    }

    // Auto-process the image
    handleProcess();
  }, []);

  const handleProcess = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to process images");
      return;
    }

    setProcessing(true);
    try {
      let result;

      switch (feature) {
        case "enhance":
          result = await enhanceImage(imageUrl);
          break;
        case "remove-bg":
          result = await removeBackground(imageUrl);
          break;
        case "upscale":
          result = await upscaleImage(imageUrl);
          break;
        case "optimize":
          result = await optimizeImage(imageUrl);
          break;
        default:
          toast.error("Unknown feature");
          return;
      }

      if (result) {
        setProcessedImage(result);
        toast.success("Image processed successfully!");
      }
    } catch (error) {
      toast.error("Processing failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement("a");
      link.href = processedImage;
      link.download = `processed-${Date.now()}.jpg`;
      link.click();
    }
  };

  const featureInfo = {
    enhance: { name: "Image Enhancement", icon: "✨", color: "purple" },
    "remove-bg": { name: "Background Removal", icon: "🎯", color: "green" },
    upscale: { name: "Image Upscaling", icon: "🔍", color: "blue" },
    optimize: { name: "Image Optimization", icon: "⚡", color: "orange" },
  };

  const currentFeature = featureInfo[feature];

  if (!currentFeature) {
    return <div>Invalid feature</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {currentFeature.icon} {currentFeature.name}
          </h1>
          <p className="text-gray-600">Processing your image with AI...</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Original Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Original Image
            </h3>
            <div className="flex justify-center">
              <img
                src={imageUrl}
                alt="Original"
                className="max-w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          </motion.div>

          {/* Processed Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Processed Image {processing && "(Processing...)"}
            </h3>

            {processing ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    AI is processing your image...
                  </p>
                </div>
              </div>
            ) : processedImage ? (
              <div className="text-center">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-w-full h-64 object-cover rounded-lg shadow-md mx-auto"
                />
                <button
                  onClick={handleDownload}
                  className="mt-4 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  💾 Download Result
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Processing will start automatically...
              </div>
            )}
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4 mt-8"
        >
          <button
            onClick={() => navigate("/upload")}
            className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors"
          >
            ← Upload Another
          </button>

          {processedImage && (
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
            >
              💾 Download Result
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProcessImage;
