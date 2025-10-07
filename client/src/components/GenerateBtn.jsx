import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const GenerateBtn = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const { user, setShowLogin, credit, isAuthenticated } =
    useContext(AppContext);
  const navigate = useNavigate();

  const onClickHandler = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    if (credit > 0) {
      navigate("/create");
    } else {
      // Show credit purchase modal or redirect to pricing
      navigate("/pricing");
    }
  };

  const textVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
      },
    },
    tap: { scale: 0.95 },
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const starVariants = {
    hover: {
      rotate: 360,
      scale: 1.2,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
    pulse: {
      scale: [1, 1.3, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const getButtonText = () => {
    if (!isAuthenticated) {
      return "Get Started - Create Free Account";
    }
    if (credit > 0) {
      return `Generate Images (${credit} credits available)`;
    }
    return "Get More Credits to Generate";
  };

  const getButtonStyle = () => {
    if (!isAuthenticated) {
      return "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700";
    }
    if (credit > 0) {
      return "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700";
    }
    return "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700";
  };

 
};

export default GenerateBtn;
