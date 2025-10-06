import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser } =
    useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Password reset states
  const [resetStep, setResetStep] = useState(0); // 0: initial, 1: verify, 2: reset password
  const [resetData, setResetData] = useState({
    name: "",
    dateOfBirth: "",
  });
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [resetToken, setResetToken] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetInputChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewPasswordChange = (e) => {
    const { name, value } = e.target;
    setNewPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (state !== "Login") {
      if (formData.name.length < 2) {
        toast.error("Name must be at least 2 characters long");
        return false;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
      if (!formData.dateOfBirth) {
        toast.error("Date of birth is required");
        return false;
      }
    }
    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const endpoint =
        state === "Login" ? "/api/user/login" : "/api/user/register";
      const payload =
        state === "Login"
          ? { email: formData.email, password: formData.password }
          : formData;

      const { data } = await axios.post(backendUrl + endpoint, payload);

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setShowLogin(false);
        navigate("/dashboard");
        toast.success(
          `Welcome${state === "Login" ? " back" : ""}, ${data.user.name}!`
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Authentication failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Verify user with username and DOB
  const handleVerifyUser = async (e) => {
    e.preventDefault();
    if (!resetData.name || !resetData.dateOfBirth) {
      toast.error("Please enter both username and date of birth");
      return;
    }

    setIsResetting(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/verify-for-reset",
        resetData
      );

      if (data.success) {
        setResetToken(data.resetToken);
        setResetStep(2); // Move to password reset step
        toast.success("Identity verified! You can now set a new password.");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify identity");
    } finally {
      setIsResetting(false);
    }
  };

  // Step 2: Reset password with new password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPasswordData.newPassword || !newPasswordData.confirmPassword) {
      toast.error("Please enter and confirm your new password");
      return;
    }

    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPasswordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsResetting(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/reset-password",
        {
          resetToken,
          newPassword: newPasswordData.newPassword,
          confirmPassword: newPasswordData.confirmPassword,
        }
      );

      if (data.success) {
        toast.success("Password reset successfully! You can now login.");
        // Reset everything and go back to login
        setResetStep(0);
        setResetData({ name: "", dateOfBirth: "" });
        setNewPasswordData({ newPassword: "", confirmPassword: "" });
        setResetToken("");
        setState("Login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  const startPasswordReset = () => {
    setResetStep(1);
    setResetData({ name: "", dateOfBirth: "" });
  };

  const goBackToLogin = () => {
    setResetStep(0);
    setResetData({ name: "", dateOfBirth: "" });
    setNewPasswordData({ newPassword: "", confirmPassword: "" });
    setResetToken("");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const navbar = document.getElementById("nav-bar");
    if (navbar) {
      navbar.style.opacity = "0.05";
    }

    return () => {
      document.body.style.overflow = "unset";
      if (navbar) {
        navbar.style.opacity = "1";
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] backdrop-blur-sm bg-black/30 flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0.2, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto"
      >
        {/* Header */}
        <div className="p-8 pb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <img
                src={assets.logo_icon}
                alt="Imagify"
                className="w-8 h-8 filter brightness-0 invert"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {resetStep === 0
                ? state
                : resetStep === 1
                ? "Verify Identity"
                : "Reset Password"}
            </h1>
            <p className="text-gray-600 text-sm">
              {resetStep === 0
                ? state === "Login"
                  ? "Welcome back! Please sign in to continue"
                  : "Create your account to start creating"
                : resetStep === 1
                ? "Enter your username and date of birth to verify your identity"
                : "Enter your new password"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 0: Login/Register Form */}
            {resetStep === 0 && (
              <motion.form
                key="auth-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={onSubmitHandler}
                className="space-y-4"
              >
                {state !== "Login" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="relative"
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <img
                        src={assets.user_icon}
                        alt=""
                        className="w-5 h-5 text-gray-400"
                      />
                    </div>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Full Name"
                      required
                    />
                  </motion.div>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img
                      src={assets.email_icon}
                      alt=""
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Email address"
                    required
                  />
                </div>

                {state !== "Login" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="relative"
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </motion.div>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img
                      src={assets.lock_icon}
                      alt=""
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Password"
                    required
                  />
                </div>

                {state !== "Login" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="relative"
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <img
                        src={assets.lock_icon}
                        alt=""
                        className="w-5 h-5 text-gray-400"
                      />
                    </div>
                    <input
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      type="password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Confirm Password"
                      required
                    />
                  </motion.div>
                )}

                {state === "Login" && (
                  <button
                    type="button"
                    onClick={startPasswordReset}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors text-right w-full"
                  >
                    Forgot your password?
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {state === "Login"
                        ? "Signing in..."
                        : "Creating account..."}
                    </div>
                  ) : state === "Login" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center text-sm text-gray-600">
                  {state === "Login" ? (
                    <p>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setState("Sign Up")}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                      >
                        Sign Up
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setState("Login")}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                      >
                        Sign In
                      </button>
                    </p>
                  )}
                </div>
              </motion.form>
            )}

            {/* Step 1: Verify Identity */}
            {resetStep === 1 && (
              <motion.form
                key="verify-identity"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyUser}
                className="space-y-4"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img
                      src={assets.user_icon}
                      alt=""
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                  <input
                    name="name"
                    value={resetData.name}
                    onChange={handleResetInputChange}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    name="dateOfBirth"
                    value={resetData.dateOfBirth}
                    onChange={handleResetInputChange}
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {isResetting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify Identity"
                  )}
                </button>

                <button
                  type="button"
                  onClick={goBackToLogin}
                  className="w-full text-gray-600 py-2 rounded-xl font-medium hover:text-blue-600 transition-colors"
                >
                  ← Back to Login
                </button>
              </motion.form>
            )}

            {/* Step 2: Reset Password */}
            {resetStep === 2 && (
              <motion.form
                key="reset-password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handlePasswordReset}
                className="space-y-4"
              >
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      Identity verified successfully!
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img
                      src={assets.lock_icon}
                      alt=""
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                  <input
                    name="newPassword"
                    value={newPasswordData.newPassword}
                    onChange={handleNewPasswordChange}
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="New Password"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img
                      src={assets.lock_icon}
                      alt=""
                      className="w-5 h-5 text-gray-400"
                    />
                  </div>
                  <input
                    name="confirmPassword"
                    value={newPasswordData.confirmPassword}
                    onChange={handleNewPasswordChange}
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Confirm New Password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {isResetting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Resetting...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setResetStep(1)}
                  className="w-full text-gray-600 py-2 rounded-xl font-medium hover:text-blue-600 transition-colors"
                >
                  ← Back to Verification
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <img src={assets.cross_icon} alt="Close" className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
