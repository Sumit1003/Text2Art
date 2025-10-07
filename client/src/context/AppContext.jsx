import React, { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { cloudinaryService } from "../services/cloudinaryService";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cloudinaryLoading, setCloudinaryLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    emailNotifications: true,
    lowCreditAlerts: true,
    marketingEmails: false,
  });

  // ✅ FIXED: Proper backend URL setup with fallback
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.MODE === "production"
      ? "https://text2art.onrender.com"
      : "https://text2art.onrender.com");

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

  // New Credit Management Functions
  const addCredits = useCallback(
    (amount) => {
      const newCredit = credit + amount;
      setCredit(newCredit);

      // Update localStorage
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...parsedUser,
            credits: newCredit,
          })
        );
      }

      // Add notification
      const notification = {
        id: Date.now(),
        type: "credit_added",
        message: `+${amount} credits added to your account`,
        timestamp: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev]);

      toast.success(`🎉 ${amount} credits added to your account!`, {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    [credit]
  );

  const deductCredits = useCallback(
    (amount) => {
      if (credit < amount) {
        throw new Error("Insufficient credits");
      }

      const newCredit = credit - amount;
      setCredit(newCredit);

      // Update localStorage
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...parsedUser,
            credits: newCredit,
          })
        );
      }

      // Check for low credit warning
      if (userPreferences.lowCreditAlerts && newCredit <= 10 && newCredit > 0) {
        toast.warning(
          `⚠️ Low credits! You have only ${newCredit} credits left.`,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }

      return newCredit;
    },
    [credit, userPreferences.lowCreditAlerts]
  );

  const canAfford = useCallback(
    (amount) => {
      return credit >= amount;
    },
    [credit]
  );

  // Purchase credits function
  const purchaseCredits = useCallback(
    async (plan) => {
      setLoading(true);
      try {
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Add credits based on plan
        const creditAmount = plan.credits || Math.floor(plan.price * 10); // Default calculation
        addCredits(creditAmount);

        // Record purchase in user data
        const purchaseRecord = {
          id: "purchase-" + Date.now(),
          plan: plan.id || plan.name,
          amount: plan.price,
          credits: creditAmount,
          date: new Date().toISOString(),
        };

        const updatedUser = {
          ...user,
          purchases: [...(user?.purchases || []), purchaseRecord],
        };

        setUser(updatedUser);

        // Update localStorage
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          localStorage.setItem(
            "userData",
            JSON.stringify({
              ...parsedUser,
              purchases: [...(parsedUser.purchases || []), purchaseRecord],
            })
          );
        }

        toast.success(
          `🎊 Purchase successful! ${creditAmount} credits added.`,
          {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        return { success: true, credits: credit + creditAmount };
      } catch (error) {
        console.error("Purchase error:", error);
        toast.error("Purchase failed. Please try again.", {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
        setShowPricing(false);
      }
    },
    [credit, user, addCredits]
  );

  // Subscribe to plan function
  const subscribeToPlan = useCallback(
    async (plan) => {
      setLoading(true);
      try {
        // Simulate subscription process
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const updatedUser = {
          ...user,
          subscription: {
            plan: plan.id || plan.name,
            status: "active",
            startDate: new Date().toISOString(),
            renewalDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        };

        setUser(updatedUser);

        // Update localStorage
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          localStorage.setItem(
            "userData",
            JSON.stringify({
              ...parsedUser,
              subscription: updatedUser.subscription,
            })
          );
        }

        // Add initial credits for the plan
        const initialCredits = plan.credits || Math.floor(plan.price * 10);
        addCredits(initialCredits);

        toast.success(
          `🎉 Successfully subscribed to ${plan.id || plan.name} plan!`,
          {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        return { success: true };
      } catch (error) {
        console.error("Subscription error:", error);
        toast.error("Subscription failed. Please try again.", {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
        setShowPricing(false);
      }
    },
    [user, addCredits]
  );

  // Update user preferences
  const updatePreferences = useCallback(
    (newPreferences) => {
      const updatedPreferences = { ...userPreferences, ...newPreferences };
      setUserPreferences(updatedPreferences);
      localStorage.setItem(
        "userPreferences",
        JSON.stringify(updatedPreferences)
      );
    },
    [userPreferences]
  );

  // Notification management
  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get subscription status
  const getSubscriptionStatus = useCallback(() => {
    if (!user?.subscription) return "none";
    return user.subscription.status;
  }, [user]);

  // Get current plan
  const getCurrentPlan = useCallback(() => {
    return user?.subscription?.plan || "Free";
  }, [user]);

  // Check if user is on free plan
  const isFreePlan = useCallback(() => {
    return getCurrentPlan() === "Free";
  }, [getCurrentPlan]);

  // Cloudinary Functions (existing)
  const removeBackground = useCallback(
    async (imageUrl) => {
      if (!isAuthenticated || !token) {
        toast.error("Please login to use AI image tools");
        return null;
      }

      setCloudinaryLoading(true);
      try {
        const result = await cloudinaryService.removeBackground(
          imageUrl,
          token
        );
        if (result.success) {
          toast.success("Background removed successfully!");
          return result.resultImage;
        } else {
          toast.error(result.message);
          return null;
        }
      } catch (error) {
        handleApiError(error, "Background removal failed");
        return null;
      } finally {
        setCloudinaryLoading(false);
      }
    },
    [token, isAuthenticated, handleApiError]
  );

  const upscaleImage = useCallback(
    async (imageUrl) => {
      if (!isAuthenticated || !token) {
        toast.error("Please login to use AI image tools");
        return null;
      }

      setCloudinaryLoading(true);
      try {
        const result = await cloudinaryService.upscaleImage(imageUrl, token);
        if (result.success) {
          toast.success("Image upscaled successfully!");
          return result.resultImage;
        } else {
          toast.error(result.message);
          return null;
        }
      } catch (error) {
        handleApiError(error, "Image upscaling failed");
        return null;
      } finally {
        setCloudinaryLoading(false);
      }
    },
    [token, isAuthenticated, handleApiError]
  );

  const enhanceImage = useCallback(
    async (imageUrl) => {
      if (!isAuthenticated || !token) {
        toast.error("Please login to use AI image tools");
        return null;
      }

      setCloudinaryLoading(true);
      try {
        const result = await cloudinaryService.enhanceImage(imageUrl, token);
        if (result.success) {
          toast.success("Image enhanced successfully!");
          return result.resultImage;
        } else {
          toast.error(result.message);
          return null;
        }
      } catch (error) {
        handleApiError(error, "Image enhancement failed");
        return null;
      } finally {
        setCloudinaryLoading(false);
      }
    },
    [token, isAuthenticated, handleApiError]
  );

  const optimizeImage = useCallback(
    async (imageUrl, options = {}) => {
      if (!isAuthenticated || !token) {
        toast.error("Please login to use AI image tools");
        return null;
      }

      setCloudinaryLoading(true);
      try {
        const result = await cloudinaryService.optimizeImage(
          imageUrl,
          options,
          token
        );
        if (result.success) {
          toast.success("Image optimized successfully!");
          return result.optimizedUrl;
        } else {
          toast.error(result.message);
          return null;
        }
      } catch (error) {
        handleApiError(error, "Image optimization failed");
        return null;
      } finally {
        setCloudinaryLoading(false);
      }
    },
    [token, isAuthenticated, handleApiError]
  );

  // Upload user image function
  const uploadImage = useCallback(
    async (imageData) => {
      if (!isAuthenticated || !token) {
        toast.error("Please login to upload images");
        return null;
      }

      setCloudinaryLoading(true);
      try {
        const result = await cloudinaryService.uploadImage(imageData, token);
        if (result.success) {
          toast.success("Image uploaded successfully");
          return {
            imageUrl: result.imageUrl,
            publicId: result.publicId,
          };
        } else {
          toast.error(result.message);
          return null;
        }
      } catch (error) {
        handleApiError(error, "Image upload failed");
        return null;
      } finally {
        setCloudinaryLoading(false);
      }
    },
    [token, isAuthenticated, handleApiError]
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

        // Store user data in localStorage for new features
        localStorage.setItem("userData", JSON.stringify(data.user));
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
    localStorage.removeItem("userData");
    localStorage.removeItem("userPreferences");
    setToken("");
    setUser(null);
    setCredit(0);
    setNotifications([]);
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

  // Initialize user preferences from localStorage
  useEffect(() => {
    const storedPreferences = localStorage.getItem("userPreferences");
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    }
  }, []);

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
    showPricing,
    setShowPricing,
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
    // Cloudinary Functions
    removeBackground,
    upscaleImage,
    enhanceImage,
    optimizeImage,
    uploadImage,
    cloudinaryLoading,
    setCloudinaryLoading,
    // New Features
    notifications,
    userPreferences,
    addCredits,
    deductCredits,
    canAfford,
    purchaseCredits,
    subscribeToPlan,
    updatePreferences,
    markNotificationAsRead,
    clearAllNotifications,
    getSubscriptionStatus,
    getCurrentPlan,
    isFreePlan,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
