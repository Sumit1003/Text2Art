import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({
  title,
  description,
  icon,
  color = "purple",
  premium = false,
  onClick,
  disabled = false,
  comingSoon = false,
  creditsRequired = 0,
  currentCredits = 0,
}) => {
  // Color mapping for consistent Tailwind class generation
  const colorMap = {
    purple: {
      bg: "bg-purple-500",
      bgHover: "bg-purple-600",
      text: "text-purple-500",
      border: "border-purple-500",
      lightBg: "bg-purple-50",
      lightText: "text-purple-600",
    },
    blue: {
      bg: "bg-blue-500",
      bgHover: "bg-blue-600",
      text: "text-blue-500",
      border: "border-blue-500",
      lightBg: "bg-blue-50",
      lightText: "text-blue-600",
    },
    green: {
      bg: "bg-green-500",
      bgHover: "bg-green-600",
      text: "text-green-500",
      border: "border-green-500",
      lightBg: "bg-green-50",
      lightText: "text-green-600",
    },
    orange: {
      bg: "bg-orange-500",
      bgHover: "bg-orange-600",
      text: "text-orange-500",
      border: "border-orange-500",
      lightBg: "bg-orange-50",
      lightText: "text-orange-600",
    },
    pink: {
      bg: "bg-pink-500",
      bgHover: "bg-pink-600",
      text: "text-pink-500",
      border: "border-pink-500",
      lightBg: "bg-pink-50",
      lightText: "text-pink-600",
    },
  };

  const colors = colorMap[color] || colorMap.purple;
  const hasEnoughCredits = currentCredits >= creditsRequired;
  const isActionDisabled =
    disabled || comingSoon || (creditsRequired > 0 && !hasEnoughCredits);

  return (
    <motion.div
      whileHover={{
        scale: isActionDisabled ? 1 : 1.05,
        y: isActionDisabled ? 0 : -5,
      }}
      whileTap={{ scale: isActionDisabled ? 1 : 0.95 }}
      className={`
        relative bg-white rounded-2xl p-6 shadow-lg border-2 cursor-pointer
        transform transition-all duration-300 group overflow-hidden
        ${premium ? "border-yellow-400 shadow-md" : "border-gray-100"}
        ${
          isActionDisabled
            ? "opacity-60 cursor-not-allowed grayscale"
            : "hover:shadow-xl"
        }
        ${!isActionDisabled && "hover:border-gray-200"}
      `}
      onClick={isActionDisabled ? undefined : onClick}
    >
      {/* Premium Badge */}
      {premium && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
          PRO
        </div>
      )}

      {/* Coming Soon Badge */}
      {comingSoon && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
          SOON
        </div>
      )}

      {/* Credit Requirement */}
      {creditsRequired > 0 && (
        <div
          className={`absolute -top-2 -left-2 ${colors.lightBg} ${colors.lightText} px-3 py-1 rounded-full text-xs font-medium shadow-lg z-10 flex items-center gap-1`}
        >
          <span>⚡</span>
          {creditsRequired} credit{creditsRequired !== 1 ? "s" : ""}
        </div>
      )}

      {/* Insufficient Credits Warning */}
      {creditsRequired > 0 && !hasEnoughCredits && (
        <div className="absolute inset-0 bg-red-50 bg-opacity-80 flex items-center justify-center rounded-2xl z-20">
          <div className="text-center p-4">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <p className="text-red-600 text-sm font-semibold">
              Insufficient Credits
            </p>
            <p className="text-red-500 text-xs mt-1">
              Need {creditsRequired - currentCredits} more
            </p>
          </div>
        </div>
      )}

      {/* Icon */}
      <div
        className={`text-4xl mb-4 ${colors.text} group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-4 leading-relaxed group-hover:text-gray-700 transition-colors">
        {description}
      </p>

      {/* Action Button */}
      {!isActionDisabled && (
        <div
          className={`inline-flex items-center px-4 py-2 rounded-full text-white ${colors.bg} hover:${colors.bgHover} transition-all duration-300 group/btn shadow-sm hover:shadow-md`}
        >
          <span className="text-sm font-medium">Use Tool</span>
          <svg
            className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform"
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
      )}

      {/* Coming Soon Message */}
      {comingSoon && (
        <div className="mt-3 p-2 bg-gray-100 rounded-lg">
          <p className="text-gray-500 text-xs text-center">
            🚀 Coming in next update
          </p>
        </div>
      )}

      {/* Credit Status */}
      {creditsRequired > 0 && hasEnoughCredits && (
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-green-600 font-medium">
            ✓ Credits available
          </span>
          <span className="text-gray-500">
            {currentCredits}/{creditsRequired}
          </span>
        </div>
      )}

      {/* Hover Background Effect */}
      <div
        className={`absolute inset-0 rounded-2xl ${colors.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`}
      ></div>

      {/* Premium Glow Effect */}
      {premium && !isActionDisabled && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10"></div>
      )}
    </motion.div>
  );
};

export default FeatureCard;
