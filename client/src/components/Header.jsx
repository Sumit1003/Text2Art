import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const handleAction = (action) => {
    if (!user) {
      setShowLogin(true);
      return;
    }

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
      default:
        navigate("/result");
    }
  };

  const quickActions = [
    {
      id: "generate",
      title: "🎨 Generate AI Images",
      description: "Create from text prompts",
      color: "purple",
      icon: "✨",
    },
    {
      id: "upload",
      title: "📤 Upload & Enhance",
      description: "Process your own images",
      color: "blue",
      icon: "⚡",
    },
    {
      id: "create",
      title: "🚀 All Features",
      description: "Explore everything",
      color: "green",
      icon: "🛠️",
    },
  ];

  return (
    <motion.div
      className="flex flex-col justify-center items-center text-center my-20"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <p>Best AI Image Generator & Editor</p>
        <img src={assets.star_icon} alt="" />
      </motion.div>

      <motion.h1 className="text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center">
        Turn text to{" "}
        <span
          className="text-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 2 }}
        >
          image
        </span>
        , in seconds
      </motion.h1>

      <motion.p
        className="text-center max-w-xl mx-auto mt-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Unleash your creativity with AI. Generate stunning visuals, enhance
        existing images, or remove backgrounds - all with powerful AI magic.
      </motion.p>

      {/* Multiple Action Buttons */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        {quickActions.map((action, index) => (
          <motion.button
            key={action.id}
            onClick={() => handleAction(action.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all ${
              action.id === "generate"
                ? "bg-black text-white hover:bg-gray-800"
                : action.id === "upload"
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
          >
            <span className="text-lg">{action.icon}</span>
            <span>{action.title}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Single Generate Button for Mobile */}
      <motion.button
        onClick={() => handleAction("generate")}
        className="sm:hidden text-lg text-white bg-black w-auto mt-6 px-8 py-3 flex items-center gap-2 rounded-full cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        Generate Images
        <img className="h-5" src={assets.star_group} alt="" />
      </motion.button>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="flex flex-wrap justify-center gap-6 mt-12"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">✓</span>
          AI Image Generation
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">✓</span>
          Background Removal
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">✓</span>
          Image Enhancement
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">✓</span>
          Fast Processing
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="flex flex-wrap justify-center mt-16 gap-3"
      >
        {Array(6)
          .fill("")
          .map((items, index) => (
            <motion.img
              whileHover={{ scale: 1.05, duration: 0.1 }}
              className="rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10"
              src={index % 2 == 0 ? assets.sample_img_2 : assets.sample_img_1}
              alt=""
              key={index}
              width={70}
            />
          ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="mt-2 text-neutral-600"
      >
        Generated images from Text2Art
      </motion.p>
    </motion.div>
  );
};

export default Header;
