import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const {
    user,
    setShowLogin,
    logout,
    credit,
    isAuthenticated,
    setShowPricing,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreditsLow, setIsCreditsLow] = useState(false);
  const [showCreditTooltip, setShowCreditTooltip] = useState(false);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const creditRef = useRef(null);

  const navItems = [
    { name: "Home", path: "/" },
    ...(isAuthenticated ? [{ name: "Dashboard", path: "/dashboard" }] : []),
    { name: "Gallery", path: "/gallery" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
  ];

  // Check if credits are low
  useEffect(() => {
    setIsCreditsLow(credit <= 10 && credit > 0);
  }, [credit]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('[aria-label="Toggle menu"]')
      ) {
        setIsOpen(false);
      }
      if (creditRef.current && !creditRef.current.contains(event.target)) {
        setShowCreditTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(!isOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  // Handle credit purchase
  const handleBuyCredits = () => {
    navigate("/pricing");
    setIsProfileOpen(false);
    closeMobileMenu();
  };

  // Handle create image with credit check
  const handleCreateImage = () => {
    if (credit > 0) {
      navigate("/create");
      closeMobileMenu();
    } else {
      toast.info(
        <div className="flex flex-col">
          <span className="font-semibold">Out of Credits!</span>
          <span>Purchase credits to continue creating amazing images.</span>
        </div>,
        {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClick: () => navigate("/pricing"),
        }
      );
      setTimeout(() => {
        navigate("/pricing");
        closeMobileMenu();
      }, 1500);
    }
  };

  // Handle quick credit purchase
  const handleQuickCreditPurchase = () => {
    setShowPricing?.(true);
    setShowCreditTooltip(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
      id="nav-bar"
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <Link
            to="/"
            className="flex items-center flex-shrink-0 group"
            aria-label="Imagify Home"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Imagify
              </span>
            </div>
          </Link>

          {/* Center - Navigation Items */}
          <nav
            className="hidden md:flex items-center space-x-1"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative group ${
                  location.pathname === item.path
                    ? "text-blue-600 bg-blue-50 border border-blue-100"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
                aria-current={
                  location.pathname === item.path ? "page" : undefined
                }
              >
                {item.name}
                {location.pathname === item.path && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Right side - Auth & Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Create Button */}
                <button
                  onClick={handleCreateImage}
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 group"
                  aria-label="Create new image"
                >
                  <svg
                    className="w-4 h-4 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-sm font-medium">Create</span>
                </button>

                {/* Credits Display with Tooltip */}
                <div className="relative" ref={creditRef}>
                  <button
                    onClick={handleQuickCreditPurchase}
                    onMouseEnter={() => setShowCreditTooltip(true)}
                    onMouseLeave={() => setShowCreditTooltip(false)}
                    className={`hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 group ${
                      isCreditsLow
                        ? "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 animate-pulse"
                        : credit === 0
                        ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                        : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isCreditsLow
                          ? "bg-orange-400"
                          : credit === 0
                          ? "bg-red-400"
                          : "bg-green-400"
                      }`}
                    ></div>
                    <span className="text-sm font-medium">
                      {credit} {credit === 1 ? "Credit" : "Credits"}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>

                  {/* Credit Tooltip */}
                  {showCreditTooltip && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-900 text-white text-sm rounded-lg py-2 px-3 shadow-xl z-50">
                      <div className="font-medium mb-1">
                        {credit === 0
                          ? "🎯 Out of Credits!"
                          : isCreditsLow
                          ? "⚠️ Credits Running Low"
                          : "💎 Credits Available"}
                      </div>
                      <div className="text-gray-300 text-xs">
                        {credit === 0
                          ? "Purchase credits to continue creating AI images."
                          : isCreditsLow
                          ? `Only ${credit} credits left. Consider topping up to avoid interruption.`
                          : `You have ${credit} credits available for image generation.`}
                      </div>
                      <button
                        onClick={handleQuickCreditPurchase}
                        className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs font-medium transition-colors"
                      >
                        {credit === 0 ? "Buy Credits" : "Get More Credits"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => setIsProfileOpen(!isProfileOpen))
                    }
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 group"
                    aria-label="User menu"
                    aria-expanded={isProfileOpen}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium group-hover:scale-105 transition-transform">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <svg
                      className="hidden sm:block w-4 h-4 text-gray-400 transition-transform group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl py-2 shadow-xl border border-gray-200 transition-all duration-200 z-50 ${
                      isProfileOpen
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 translate-y-2 invisible"
                    }`}
                    role="menu"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {user?.email}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              isCreditsLow
                                ? "bg-orange-400"
                                : credit === 0
                                ? "bg-red-400"
                                : "bg-green-400"
                            }`}
                          ></div>
                          <span
                            className={`text-xs font-medium ${
                              isCreditsLow
                                ? "text-orange-600"
                                : credit === 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {credit} credits
                          </span>
                        </div>
                        <button
                          onClick={handleBuyCredits}
                          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
                        >
                          Buy More
                        </button>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                        role="menuitem"
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Login/Signup Buttons */}
                <button
                  onClick={() => setShowLogin(true)}
                  onKeyDown={(e) => handleKeyDown(e, () => setShowLogin(true))}
                  className="hidden md:block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
                  aria-label="Login"
                >
                  Get Started
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                onKeyDown={(e) => handleKeyDown(e, toggleMobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                tabIndex={0}
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen
              ? "opacity-100 max-h-96 border-t border-gray-200"
              : "opacity-0 max-h-0"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-blue-600 bg-blue-50 border border-blue-100"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {/* Mobile Credits Display */}
                <div className="px-3 py-2">
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isCreditsLow
                        ? "bg-orange-50 border-orange-200"
                        : credit === 0
                        ? "bg-red-50 border-red-200"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isCreditsLow
                            ? "bg-orange-400"
                            : credit === 0
                            ? "bg-red-400"
                            : "bg-green-400"
                        }`}
                      ></div>
                      <span
                        className={`text-sm font-medium ${
                          isCreditsLow
                            ? "text-orange-700"
                            : credit === 0
                            ? "text-red-700"
                            : "text-green-700"
                        }`}
                      >
                        {credit} Credits Available
                      </span>
                    </div>
                    <button
                      onClick={handleBuyCredits}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
                    >
                      Buy More
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleCreateImage}
                  className="w-full text-left px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Create New Image</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowLogin(true);
                  closeMobileMenu();
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
