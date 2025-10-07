import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("newsletter");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { user, isAuthenticated } = useContext(AppContext);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("🎉 Successfully subscribed to our newsletter!");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(
        "📧 Thank you for your message! We'll get back to you soon."
      );
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
      setActiveTab("newsletter");
    }, 1500);
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    ...(isAuthenticated ? [{ name: "Dashboard", path: "/dashboard" }] : []),
  ];

  const supportLinks = [
    { name: "Help Center", path: "/help" },
    { name: "Documentation", path: "/docs" },
    { name: "API Reference", path: "/api-docs" },
    { name: "Community", path: "/community" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" },
    { name: "Data Processing", path: "/data-processing" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: assets.github_icon,
      url: "https://github.com/phoenixdev100/Imagify",
      color: "hover:bg-gray-900 hover:border-gray-900",
      description: "Star our repo",
    },
    {
      name: "LinkedIn",
      icon: assets.linkedin_icon,
      url: "https://www.linkedin.com/in/phoenixdev100/",
      color: "hover:bg-blue-600 hover:border-blue-600",
      description: "Connect with us",
    },
    {
      name: "Twitter",
      icon: assets.twitter_icon,
      url: "#",
      color: "hover:bg-blue-400 hover:border-blue-400",
      description: "Follow updates",
    },
    {
      name: "Discord",
      icon: assets.discord_icon,
      url: "#",
      color: "hover:bg-indigo-500 hover:border-indigo-500",
      description: "Join community",
    },
  ];

  

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <img
                    src={assets.logo_icon}
                    alt="Imagify"
                    className="w-6 h-6 filter brightness-0 invert"
                  />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Imagify
                  </span>
                  <p className="text-xs text-gray-500 -mt-1">
                    AI-Powered Creativity
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">
                Transform your imagination into stunning visual art with our
                advanced AI technology. Create, inspire, and share your vision
                with the world.
              </p>

              {/* Social Links with enhanced info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white transition-all duration-300 ${social.color} group relative`}
                      aria-label={`Follow us on ${social.name}`}
                      title={`${social.name}: ${social.description}`}
                    >
                      <img
                        src={social.icon}
                        alt={social.name}
                        className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:filter group-hover:brightness-0 group-hover:invert"
                      />
                    </a>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Join our community of AI artists and creators
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 mr-2 transition-opacity duration-200"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Legal */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    Support
                  </h3>
                  <ul className="space-y-3">
                    {supportLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.path}
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                        >
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 mr-2 transition-opacity duration-200"></span>
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    Legal
                  </h3>
                  <ul className="space-y-3">
                    {legalLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          to={link.path}
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                        >
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 mr-2 transition-opacity duration-200"></span>
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Newsletter & Contact */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setActiveTab("newsletter")}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      activeTab === "newsletter"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Newsletter
                  </button>
                  <button
                    onClick={() => setActiveTab("contact")}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      activeTab === "contact"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Contact
                  </button>
                </div>

                {activeTab === "newsletter" ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                      Stay Updated
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      Get the latest updates on new features, AI advancements,
                      and exclusive offers delivered to your inbox.
                    </p>
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-400"
                            disabled={isSubmitting}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-sm hover:shadow-md"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Subscribing...
                            </div>
                          ) : (
                            "Subscribe"
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        No spam ever. Unsubscribe anytime.
                      </p>
                    </form>
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                      Get In Touch
                    </h3>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="name"
                          value={contactForm.name}
                          onChange={handleContactChange}
                          placeholder="Your Name"
                          className="col-span-2 sm:col-span-1 px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-400"
                          disabled={isSubmitting}
                        />
                        <input
                          type="email"
                          name="email"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          placeholder="Your Email"
                          className="col-span-2 sm:col-span-1 px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-400"
                          disabled={isSubmitting}
                        />
                      </div>
                      <input
                        type="text"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactChange}
                        placeholder="Subject"
                        className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-400"
                        disabled={isSubmitting}
                      />
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        placeholder="Your message..."
                        rows="3"
                        className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-400 resize-none"
                        disabled={isSubmitting}
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </div>
                        ) : (
                          "Send Message"
                        )}
                      </button>
                    </form>
                  </>
                )}

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
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
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <a
                        href="mailto:support@imagify.com"
                        className="hover:text-blue-600 transition-colors"
                      >
                        support@imagify.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>Global AI Service</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>© {currentYear} Imagify AI. All rights reserved.</span>
              <div className="hidden md:flex items-center gap-4">
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>Made with ❤️ for creators</span>
                {user && (
                  <>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>Welcome back, {user.name}!</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs">5.0 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
