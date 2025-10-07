import React, { useContext, useState } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const Pricing = () => {
  const { user } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNotifyMe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setLoading(false);
    setEmail("");
  };

  const getCurrentPlan = () => {
    if (!user?.subscription) return null;
    return plans.find((plan) => plan.id === user.subscription.plan) || null;
  };

  const currentPlan = getCurrentPlan();

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-screen py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-block border border-blue-200 bg-blue-50 text-blue-600 px-6 py-2 rounded-full mb-6 text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {currentPlan
              ? `Current Plan: ${currentPlan.id}`
              : "Choose Your Plan"}
          </motion.span>
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {currentPlan
              ? "Upgrade Your Experience"
              : "Flexible Plans for Every Creator"}
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {currentPlan
              ? "Unlock more features and get better value with our premium plans"
              : "Powerful AI image generation plans designed to scale with your creativity"}
          </motion.p>
        </div>

        {/* Current Plan Banner */}
        {currentPlan && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-12 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Active Plan: {currentPlan.id}
                </h3>
                <p className="text-green-600">
                  {currentPlan.credits} credits • ${currentPlan.price}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">Renews in 30 days</p>
                <button className="text-green-700 hover:text-green-800 font-medium text-sm">
                  Manage Subscription
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((item, index) => {
            const isCurrentPlan = currentPlan?.id === item.id;
            const isPopular = item.popular;

            return (
              <motion.div
                key={index}
                className={`relative rounded-2xl border p-8 transition-all duration-500 hover:scale-105 ${
                  isCurrentPlan
                    ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-lg"
                    : isPopular
                    ? "bg-white border-2 border-purple-300 shadow-xl ring-2 ring-purple-100 ring-opacity-50"
                    : "bg-white border-gray-100 shadow-lg hover:shadow-xl"
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Current Plan
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isPopular
                        ? "bg-gradient-to-br from-purple-500 to-pink-600"
                        : "bg-gradient-to-br from-blue-500 to-purple-600"
                    }`}
                  >
                    <img
                      width={24}
                      src={assets.logo_icon}
                      alt=""
                      className="filter brightness-0 invert"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {item.id}
                    </h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-3xl font-bold text-gray-800">
                    ${item.price}
                    <span className="text-sm font-normal text-gray-500">
                      {" "}
                      / {item.credits} credits
                    </span>
                  </p>
                  {item.savings && (
                    <p className="text-green-600 text-sm font-medium mt-1">
                      Save {item.savings}% vs monthly
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {item.features?.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <svg
                        className="w-4 h-4 text-green-500 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {feature}
                    </li>
                  )) || (
                    <>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-green-500 mr-3 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        High-quality AI image generation
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-green-500 mr-3 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Fast processing times
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-green-500 mr-3 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Multiple art styles
                      </li>
                    </>
                  )}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                    isCurrentPlan
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : isPopular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                  }`}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Current Plan" : "Get Started"}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Notification Section */}
        <motion.div
          className="text-center mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto border border-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {isSubscribed ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                You're on the list!
              </h3>
              <p className="text-gray-600 mb-6">
                We'll notify you as soon as new features and plans are
                available.
              </p>
              <button
                onClick={() => setIsSubscribed(false)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Be the First to Know
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get notified when we launch new features, special offers, and
                exclusive early access opportunities.
              </p>
              <form
                onSubmit={handleNotifyMe}
                className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Subscribing...
                    </div>
                  ) : (
                    "Notify Me"
                  )}
                </button>
              </form>
              <p className="text-gray-500 text-sm mt-3">
                No spam, unsubscribe at any time
              </p>
            </>
          )}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "Can I change plans anytime?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                question: "Do credits roll over?",
                answer:
                  "Unused credits do not roll over to the next billing cycle in monthly plans.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, PayPal, and various regional payment methods.",
              },
              {
                question: "Is there a free trial?",
                answer:
                  "We offer a free tier with limited credits so you can test our service before committing.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <h4 className="font-semibold text-gray-800 mb-2">
                  {faq.question}
                </h4>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Pricing;
