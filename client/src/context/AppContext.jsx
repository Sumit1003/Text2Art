import React, { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(0);
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const isAuthenticated = !!token;

  // Enhanced error handler
  const handleApiError = useCallback(
    (error, defaultMessage = "Something went wrong") => {
      console.error("API Error:", error);

      if (error.response) {
        // Server responded with error status
        const message =
          error.response.data?.message || error.response.statusText;
        const status = error.response.status;

        console.log(`Server error ${status}:`, error.response.data);

        if (status === 401 || status === 403) {
          toast.error("Session expired. Please login again.");
          logout();
          return;
        }

        if (status === 404) {
          toast.error("Resource not found.");
          return;
        }

        toast.error(message || defaultMessage);
      } else if (error.request) {
        // Request made but no response received
        console.log("No response received:", error.request);
        toast.error("Network error. Please check your connection.");
      } else {
        // Something else happened
        console.log("Error:", error.message);
        toast.error(error.message || defaultMessage);
      }
    },
    []
  );

  const loadCreditsData = useCallback(async () => {
    try {
      console.log("Loading credits with token:", token ? "Exists" : "Missing");

      const { data } = await axios.get(backendUrl + "/api/user/credits", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Credits response:", data);

      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleApiError(error, "Failed to load credits");
    }
  }, [token, backendUrl, handleApiError]);

  const generateImage = useCallback(
    async (prompt) => {
      setLoading(true);
      try {
        console.log("Generating image with prompt:", prompt);

        const { data } = await axios.post(
          backendUrl + "/api/image/generate-image",
          { prompt },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 120000, // 2 minutes timeout for image generation
          }
        );

        console.log("Generate image response:", data);

        if (data.success) {
          toast.success("Image generated successfully!");
          await loadCreditsData(); // Wait for credits to update
          return data.resultImage;
        } else {
          toast.error(data.message);
          if (data.creditBalance === 0) {
            // Removed navigate since we can't use hook here
            setShowLogin(true); // Show login modal instead
          }
          return null;
        }
      } catch (error) {
        handleApiError(error, "Image generation failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, backendUrl, loadCreditsData, handleApiError]
  );

  const logout = useCallback(() => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCredit(0);
    // Removed navigate since we can't use hook here
    window.location.href = "/"; // Use window.location instead
  }, []);

  // Check token validity on app start
  const checkTokenValidity = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(backendUrl + "/api/user/check-token", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!data.success) {
        console.log("Token is invalid, logging out...");
        logout();
      }
    } catch (error) {
      console.log("Token check failed, logging out...");
      logout();
    }
  }, [token, backendUrl, logout]);

  useEffect(() => {
    if (token) {
      checkTokenValidity();
      loadCreditsData();
    }
  }, [token, checkTokenValidity, loadCreditsData]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
    isAuthenticated,
    loading,
    setLoading,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;