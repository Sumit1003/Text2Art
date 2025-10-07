import React, { useState, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const Profile = () => {
  const {
    user,
    credit,
    updateProfile,
    logout,
    isAuthenticated,
    userPreferences,
    updatePreferences,
  } = useContext(AppContext);
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    website: user?.website || "",
    location: user?.location || "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: userPreferences?.emailNotifications ?? true,
    lowCreditAlerts: userPreferences?.lowCreditAlerts ?? true,
    marketingEmails: userPreferences?.marketingEmails ?? false,
    autoSaveGallery: userPreferences?.autoSaveGallery ?? true,
    highQualityDownloads: userPreferences?.highQualityDownloads ?? true,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 max-w-md"
          >
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in to view your profile
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all">
              Login to Continue
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setUploading(true);
    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const reader = new FileReader();
      reader.onload = (e) => {
        // In a real app, you would upload to your server and get back a URL
        const newAvatar = e.target.result;
        updateProfile({ avatar: newAvatar });
        toast.success("Profile picture updated successfully!");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      await updatePreferences(preferences);
      toast.success("Preferences saved successfully!");
    } catch (error) {
      toast.error("Failed to save preferences");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "edit", name: "Edit Profile", icon: "✏️" },
    { id: "preferences", name: "Preferences", icon: "⚙️" },
    { id: "billing", name: "Billing & Plans", icon: "💳" },
    { id: "security", name: "Security", icon: "🔒" },
  ];

  const stats = [
    {
      label: "Credits Available",
      value: credit,
      icon: "⚡",
      color: "text-green-600",
    },
    {
      label: "Images Generated",
      value: user?.imagesGenerated || 0,
      icon: "🖼️",
      color: "text-blue-600",
    },
    {
      label: "Member Since",
      value: "2024",
      icon: "📅",
      color: "text-purple-600",
    },
    {
      label: "Account Tier",
      value: user?.subscription?.plan || "Free",
      icon: "🏆",
      color: "text-orange-600",
    },
  ];

  const recentActivity = [
    {
      type: "image_generated",
      text: 'Generated "Cyberpunk cityscape"',
      time: "2 hours ago",
      icon: "🎨",
    },
    {
      type: "credit_used",
      text: "Used 1 credit for enhancement",
      time: "1 day ago",
      icon: "⚡",
    },
    {
      type: "profile_update",
      text: "Updated profile picture",
      time: "2 days ago",
      icon: "👤",
    },
    {
      type: "image_saved",
      text: "Saved image to gallery",
      time: "3 days ago",
      icon: "💾",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent mb-4">
            Your Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200 sticky top-8"
            >
              {/* Profile Card */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <img
                      src={user?.avatar || assets.profile_icon}
                      alt={user?.name}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-semibold">
                        Change
                      </span>
                    </div>
                  </motion.div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {user?.name}
                </h2>
                <p className="text-gray-600 text-sm mb-2">{user?.email}</p>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Active
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-4 border border-red-200"
              >
                <span className="text-lg">🚪</span>
                <span className="font-medium">Logout</span>
              </button>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center"
                      >
                        <div className={`text-2xl mb-2 ${stat.color}`}>
                          {stat.icon}
                        </div>
                        <div className="text-2xl font-bold text-gray-800 mb-1">
                          {stat.value}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>📈</span>
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium">
                              {activity.text}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {activity.time}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-2xl text-left shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="text-2xl mb-2">🎨</div>
                      <h4 className="font-bold text-lg mb-2">
                        Create New Image
                      </h4>
                      <p className="text-purple-100 text-sm">
                        Start generating amazing AI art
                      </p>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl text-left shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="text-2xl mb-2">📚</div>
                      <h4 className="font-bold text-lg mb-2">View Gallery</h4>
                      <p className="text-green-100 text-sm">
                        Browse your created images
                      </p>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Edit Profile Tab */}
              {activeTab === "edit" && (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <span>👤</span>
                      Edit Profile
                    </h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-purple-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="bg-green-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        disabled={!isEditing}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                        placeholder="Your city or country"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span>⚙️</span>
                    Preferences & Settings
                  </h3>

                  <div className="space-y-6">
                    {/* Notification Settings */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        🔔 Notifications
                      </h4>
                      <div className="space-y-4">
                        {[
                          {
                            key: "emailNotifications",
                            label: "Email Notifications",
                            description:
                              "Receive updates about new features and announcements",
                          },
                          {
                            key: "lowCreditAlerts",
                            label: "Low Credit Alerts",
                            description:
                              "Get notified when your credits are running low",
                          },
                          {
                            key: "marketingEmails",
                            label: "Marketing Emails",
                            description: "Receive promotional offers and tips",
                          },
                        ].map((setting) => (
                          <div
                            key={setting.key}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                          >
                            <div>
                              <div className="font-medium text-gray-800">
                                {setting.label}
                              </div>
                              <div className="text-sm text-gray-600">
                                {setting.description}
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preferences[setting.key]}
                                onChange={(e) =>
                                  handlePreferenceChange(
                                    setting.key,
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Application Settings */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        🎨 Application
                      </h4>
                      <div className="space-y-4">
                        {[
                          {
                            key: "autoSaveGallery",
                            label: "Auto-save to Gallery",
                            description:
                              "Automatically save all generated images to your gallery",
                          },
                          {
                            key: "highQualityDownloads",
                            label: "High Quality Downloads",
                            description:
                              "Download images in highest available quality",
                          },
                        ].map((setting) => (
                          <div
                            key={setting.key}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                          >
                            <div>
                              <div className="font-medium text-gray-800">
                                {setting.label}
                              </div>
                              <div className="text-sm text-gray-600">
                                {setting.description}
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preferences[setting.key]}
                                onChange={(e) =>
                                  handlePreferenceChange(
                                    setting.key,
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSavePreferences}
                      className="bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
                    >
                      Save Preferences
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Billing & Plans Tab */}
              {activeTab === "billing" && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span>💳</span>
                    Billing & Subscription
                  </h3>

                  <div className="space-y-6">
                    {/* Current Plan */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">
                            Current Plan
                          </h4>
                          <p className="text-gray-600">
                            {user?.subscription?.plan || "Free Tier"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            {user?.subscription?.plan === "Pro"
                              ? "$19.99"
                              : user?.subscription?.plan === "Enterprise"
                              ? "$49.99"
                              : "Free"}
                          </div>
                          <div className="text-sm text-gray-500">per month</div>
                        </div>
                      </div>
                      <button className="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors">
                        Upgrade Plan
                      </button>
                    </div>

                    {/* Credit Balance */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">
                        Credit Balance
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-green-600">
                          {credit}
                        </div>
                        <div className="text-sm text-gray-600">
                          credits available
                        </div>
                      </div>
                      <button className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors mt-4">
                        Buy More Credits
                      </button>
                    </div>

                    {/* Billing History */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Billing History
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            date: "Jan 15, 2024",
                            description: "Pro Plan Subscription",
                            amount: "$19.99",
                            status: "Paid",
                          },
                          {
                            date: "Dec 15, 2023",
                            description: "Credit Purchase",
                            amount: "$9.99",
                            status: "Paid",
                          },
                          {
                            date: "Nov 15, 2023",
                            description: "Pro Plan Subscription",
                            amount: "$19.99",
                            status: "Paid",
                          },
                        ].map((invoice, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                          >
                            <div>
                              <div className="font-medium text-gray-800">
                                {invoice.description}
                              </div>
                              <div className="text-sm text-gray-500">
                                {invoice.date}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-800">
                                {invoice.amount}
                              </div>
                              <div className="text-sm text-green-600">
                                {invoice.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span>🔒</span>
                    Security Settings
                  </h3>

                  <div className="space-y-6">
                    {/* Password Change */}
                    <div className="border border-gray-200 rounded-2xl p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Change Password
                      </h4>
                      <div className="space-y-4">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button className="bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Session Management */}
                    <div className="border border-gray-200 rounded-2xl p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Active Sessions
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                              <div className="font-medium text-gray-800">
                                Current Session
                              </div>
                              <div className="text-sm text-gray-500">
                                Chrome • Windows • Just now
                              </div>
                            </div>
                          </div>
                          <div className="text-green-600 text-sm font-medium">
                            Active
                          </div>
                        </div>
                      </div>
                      <button className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors mt-4">
                        Logout All Other Sessions
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
