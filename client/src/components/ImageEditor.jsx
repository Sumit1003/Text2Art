import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const ImageEditor = ({ imageUrl, onImageProcessed }) => {
  const {
    removeBackground,
    upscaleImage,
    enhanceImage,
    optimizeImage,
    isAuthenticated,
    cloudinaryLoading,
  } = useContext(AppContext);

  const [activeOperation, setActiveOperation] = useState("");

  const handleOperation = async (operation) => {
    if (!isAuthenticated) {
      toast.error("Please login to use AI image tools");
      return;
    }

    setActiveOperation(operation);

    try {
      let processedImage;

      switch (operation) {
        case "remove-bg":
          processedImage = await removeBackground(imageUrl);
          break;
        case "upscale":
          processedImage = await upscaleImage(imageUrl);
          break;
        case "enhance":
          processedImage = await enhanceImage(imageUrl);
          break;
        case "optimize":
          processedImage = await optimizeImage(imageUrl, {
            quality: "auto:best",
            format: "webp",
          });
          break;
        default:
          return;
      }

      if (processedImage) {
        onImageProcessed(processedImage);
      }
    } catch (error) {
      console.error(`${operation} error:`, error);
      toast.error(`Failed to ${operation.replace("-", " ")} image`);
    } finally {
      setActiveOperation("");
    }
  };

  const operations = [
    {
      id: "remove-bg",
      name: "Remove Background",
      icon: "🎯",
      description: "AI-powered background removal",
      color: "green",
      badge: "AI",
    },
    {
      id: "upscale",
      name: "Upscale Image",
      icon: "🔍",
      description: "Increase image resolution",
      color: "blue",
      badge: "HD",
    },
    {
      id: "enhance",
      name: "Enhance Quality",
      icon: "✨",
      description: "AI image enhancement",
      color: "purple",
      badge: "AI",
    },
    {
      id: "optimize",
      name: "Optimize & Deliver",
      icon: "⚡",
      description: "Compress and optimize",
      color: "orange",
      badge: "FAST",
    },
  ];

  return (
    <div className="bg-white">

      {/* Loading State */}
      {cloudinaryLoading && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="text-center">
              <p className="font-semibold text-blue-800 text-lg">
                Processing {activeOperation.replace("-", " ")}...
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Using AI to enhance your image. This may take a few seconds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Required */}
      {!isAuthenticated && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-xl">🔒</span>
            <p className="font-semibold text-yellow-800">
              Authentication Required
            </p>
          </div>
          <p className="text-yellow-700 text-sm">
            Please login to access all AI image enhancement tools and unlock the
            full power of Text2Art!
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
