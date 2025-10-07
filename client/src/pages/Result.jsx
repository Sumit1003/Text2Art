import React, { useContext, useEffect, useState, useRef } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import ImageEditor from "../components/ImageEditor";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";

const ChevronIcon = ({ open }) => (
  <svg
    className={`h-5 transition-transform ${open ? "rotate-180" : ""}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

// Custom Dropdown
const CustomDropdown = ({
  format = "",
  setFormat = () => {},
  formats = [],
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-transparent w-40 border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer text-center"
      >
        <div className="flex justify-between">
          <p>{format}</p>
          <ChevronIcon open={open} />
        </div>
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute rounded-xl z-50 mt-1 w-40 bg-white border border-zinc-250 shadow-lg"
        >
          {formats.map((fmt) => (
            <div
              key={fmt}
              role="menuitem"
              tabIndex={0}
              onClick={() => {
                setFormat(fmt);
                setOpen(false);
              }}
              className="text-black px-8 py-3 rounded-xl hover:bg-zinc-200 cursor-pointer text-center"
            >
              {fmt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [format, setFormat] = useState("PNG");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    generateImage,
    isAuthenticated,
    removeBackground,
    enhanceImage,
    setShowLogin,
  } = useContext(AppContext);

  const action = searchParams.get("action");

  // Handle direct feature access via URL parameters
  useEffect(() => {
    if (action && isAuthenticated && isImageLoaded) {
      handleFeatureAction(action);
    }
  }, [action, isAuthenticated, isImageLoaded]);

  const handleFeatureAction = async (actionType) => {
    if (!isImageLoaded) {
      toast.info("Please wait for image generation to complete");
      return;
    }

    switch (actionType) {
      case "enhance":
        const enhanced = await enhanceImage(image);
        if (enhanced) {
          setImage(enhanced);
          toast.success("Image enhanced successfully!");
        }
        break;
      case "remove-bg":
        const bgRemoved = await removeBackground(image);
        if (bgRemoved) {
          setImage(bgRemoved);
          toast.success("Background removed successfully!");
        }
        break;
      default:
        break;
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (input) {
      const generatedImage = await generateImage(input);
      if (generatedImage) {
        setIsImageLoaded(true);
        setImage(generatedImage);
        toast.success("Image generated successfully!");

        // Auto-process if action parameter exists
        if (action && isAuthenticated) {
          setTimeout(() => {
            handleFeatureAction(action);
          }, 1000);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Browser-compatible image loading function
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Convert Image into different formats [JPEG, PNG, SVG, WebP]
  const convertImage = async (input, format) => {
    try {
      const image = await loadImage(input);
      const extension = format.toLowerCase();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      // Trigger image download
      const downloadImage = (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `imagify-${Date.now()}.${extension}`;
        link.click();
        URL.revokeObjectURL(url);
      };

      if (extension === "svg") {
        const dataUrl = canvas.toDataURL("image/png");
        const svgContent = `
          <svg xmlns='http://www.w3.org/2000/svg' width='${image.width}' height='${image.height}'>
            <image href='${dataUrl}' width='${image.width}' height='${image.height}'/>
          </svg>`;
        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        downloadImage(blob);
      } else {
        canvas.toBlob((blob) => {
          if (blob) downloadImage(blob);
          else console.error("Failed to convert canvas to blob.");
        }, `image/${extension === "jpg" ? "jpeg" : extension}`);
      }
    } catch (error) {
      console.error("Error converting image:", error);
      toast.error("Failed to download image");
    }
  };

  // Quick action buttons for direct feature access
  const quickActions = [
    {
      id: "enhance",
      name: "Enhance Image",
      icon: "✨",
      color: "purple",
      description: "AI-powered quality enhancement",
    },
    {
      id: "remove-bg",
      name: "Remove Background",
      icon: "🎯",
      color: "green",
      description: "Remove background automatically",
    },
  ];

  const handleQuickAction = async (actionId) => {
    if (!isAuthenticated) {
      toast.error("Please login to use AI tools");
      setShowLogin(true);
      return;
    }

    if (!isImageLoaded) {
      toast.info("Please generate an image first");
      return;
    }

    await handleFeatureAction(actionId);
  };

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className="flex flex-col min-h-[90vh] justify-center items-center px-4"
    >
      {/* Image Display Section */}
      <div className="text-center">
        <div className="relative inline-block">
          <img
            src={image}
            alt="Generated result"
            className="max-w-full md:max-w-sm rounded-lg shadow-lg border border-gray-200"
          />
          <span
            className={`absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000 ${
              loading ? "w-full" : "w-0"
            }`}
          ></span>
        </div>
        <p className={`mt-2 text-sm text-gray-600 ${!loading ? "hidden" : ""}`}>
          {loading ? "Generating your image..." : ""}
        </p>
      </div>

      {/* Quick Prompts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-center"
      >
        <p className="text-gray-600 mb-3 font-medium">Try these prompts:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Cyberpunk cityscape",
            "Fantasy castle in clouds",
            "Abstract liquid art",
            "Portrait of an astronaut",
          ].map((prompt) => (
            <motion.button
              key={prompt}
              type="button"
              onClick={() => setInput(prompt)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Generate New Image Form */}
      {!isImageLoaded && (
        <div className="flex flex-col items-center w-full max-w-2xl">
          <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Describe what you want to generate..."
              className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-gray-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      )}

      {/* After Image Generation - Tools Section */}
      {isImageLoaded && (
        <div className="flex flex-col items-center w-full max-w-6xl mt-8">
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full max-w-2xl">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                disabled={!isAuthenticated}
                className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                  isAuthenticated
                    ? `bg-${action.color}-50 border-${action.color}-200 hover:border-${action.color}-500 hover:shadow-md cursor-pointer`
                    : "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
                }`}
              >
                <span className="text-2xl mr-3">{action.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-gray-800">
                    {action.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {action.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap justify-center mb-8">
            <button
              onClick={() => setIsImageLoaded(false)}
              className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer hover:bg-zinc-50 transition-colors"
            >
              Generate Another
            </button>
            <CustomDropdown
              format={format}
              setFormat={setFormat}
              formats={["JPEG", "PNG", "WebP", "SVG"]}
            />
            <button
              onClick={async (e) => {
                e.preventDefault();
                await convertImage(image, format);
              }}
              className="w-40 bg-zinc-900 px-10 py-3 rounded-full cursor-pointer hover:bg-zinc-800 transition-colors text-white"
            >
              Download
            </button>
          </div>

          {/* Cloudinary AI Tools Section */}
          <div className="w-full max-w-4xl">
            <ImageEditor
              imageUrl={image}
              onImageProcessed={(processedImage) => {
                setImage(processedImage);
                toast.success("Image processed successfully!");
              }}
            />
          </div>

          {/* Info Section */}
          {!isAuthenticated && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md text-center">
              <p className="text-blue-800 text-sm">
                💡 <strong>Pro Tip:</strong> Login to access all AI image
                enhancement tools!
              </p>
            </div>
          )}
        </div>
      )}
    </motion.form>
  );
};

export default Result;