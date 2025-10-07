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

  // ✅ FIXED: Proper backend URL setup with fallback
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.MODE === "production"
      ? "https://text2art.onrender.com"
      : "http://localhost:5000");

  console.log("✅ Backend URL in use:", backendUrl);

  const isAuthenticated = !!token;

  // ✅ Set axios defaults (optional but recommended)
  axios.defaults.baseURL = backendUrl;
  axios.defaults.headers.common["Content-Type"] = "application/json";

  // Enhanced error handler
  const handleApiError = useCallback(
    (error, defaultMessage = "Something went wrong") => {
      console.error("API Error:", error);

      if (error.response) {
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
        console.log("No response received:", error.request);
        toast.error("Network error. Please check your connection.");
      } else {
        console.log("Error:", error.message);
        toast.error(error.message || defaultMessage);
      }
    },
    []
  );

  const loadCreditsData = useCallback(async () => {
    try {
      console.log("Loading credits with token:", token ? "Exists" : "Missing");

      const { data } = await axios.get("/api/user/credits", {
        headers: {
          Authorization: `Bearer ${token}`,
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
  }, [token, handleApiError]);

  const generateImage = useCallback(
    async (prompt) => {
      setLoading(true);
      try {
        console.log("Generating image with prompt:", prompt);

        const { data } = await axios.post(
          "/api/image/generate-image",
          { prompt },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 120000,
          }
        );

        console.log("Generate image response:", data);

        if (data.success) {
          toast.success("Image generated successfully!");
          await loadCreditsData();
          return data.resultImage;
        } else {
          toast.error(data.message);
          if (data.creditBalance === 0) {
            setShowLogin(true);
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
    [token, loadCreditsData, handleApiError]
  );

  const logout = useCallback(() => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCredit(0);
    window.location.href = "/";
  }, []);

  const checkTokenValidity = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await axios.get("/api/user/check-token", {
        headers: {
          Authorization: `Bearer ${token}`,
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
  }, [token, logout]);

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
