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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          ✨ AI Image Tools
        </h3>
        <p className="text-gray-600">
          Enhance your generated images with powerful AI tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {operations.map((op) => (
          <button
            key={op.id}
            onClick={() => handleOperation(op.id)}
            disabled={cloudinaryLoading}
            className={`
              relative p-5 rounded-xl border-2 transition-all duration-300 text-left
              group hover:scale-105 transform
              ${
                activeOperation === op.id
                  ? `bg-${op.color}-50 border-${op.color}-500 shadow-lg scale-105`
                  : `bg-white border-gray-200 hover:border-${op.color}-400 hover:shadow-md`
              }
              ${
                cloudinaryLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
            `}
          >
            {/* Badge */}
            <span
              className={`absolute -top-2 -right-2 px-2 py-1 text-xs font-semibold rounded-full bg-${op.color}-500 text-white`}
            >
              {op.badge}
            </span>

            <div className="flex items-center space-x-4">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {op.icon}
              </span>
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-lg mb-1">
                  {op.name}
                </div>
                <div className="text-sm text-gray-600">{op.description}</div>
              </div>
            </div>

            {/* Hover effect */}
            <div
              className={`absolute inset-0 rounded-xl bg-${op.color}-500 opacity-0 group-hover:opacity-5 transition-opacity`}
            ></div>
          </button>
        ))}
      </div>

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
            full power of Imagify!
          </p>
        </div>
      )}

      {/* Features Preview */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-500 text-center">
        <div>🎯 Background Removal</div>
        <div>🔍 2x Upscaling</div>
        <div>✨ AI Enhancement</div>
      </div>
    </div>
  );
};

export default ImageEditor;
