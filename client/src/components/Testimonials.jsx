import React, { useState } from "react";
import { assets, testimonialsData } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonialVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const starVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.4,
        ease: "backOut",
      },
    }),
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-purple-50/30 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 border border-gray-200 shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            <span className="text-purple-600 font-semibold text-sm">
              Trusted by Creators
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Loved by Creators Worldwide
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Join thousands of artists, designers, and creators who are
            transforming their ideas into stunning visual art with Imagify
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            {[
              { number: "10K+", label: "Images Created" },
              { number: "2K+", label: "Happy Users" },
              { number: "4.9/5", label: "Average Rating" },
              { number: "98%", label: "Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence>
            {testimonialsData.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={testimonialVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "-50px" }}
                className={`relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 transition-all duration-300 cursor-pointer group ${
                  testimonial.featured
                    ? "lg:col-span-2 border-purple-200 shadow-2xl"
                    : "border-gray-200/80 hover:border-purple-300 shadow-lg hover:shadow-xl"
                }`}
                onMouseEnter={() => setActiveTestimonial(index)}
              >
                {/* Featured badge */}
                {testimonial.featured && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg"
                  >
                    Featured
                  </motion.div>
                )}

                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  {/* Header with avatar and info */}
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                      />
                      {/* Online indicator */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg leading-tight">
                            {testimonial.name}
                          </h3>
                          <p className="text-purple-600 font-medium text-sm">
                            {testimonial.role}
                          </p>
                          {testimonial.company && (
                            <p className="text-gray-500 text-sm">
                              {testimonial.company}
                            </p>
                          )}
                        </div>

                        {/* Social handle */}
                        {testimonial.social && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-gray-400 text-sm hidden sm:block"
                          >
                            {testimonial.social}
                          </motion.span>
                        )}
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1">
                        {Array(testimonial.stars)
                          .fill()
                          .map((_, i) => (
                            <motion.div
                              key={i}
                              custom={i}
                              variants={starVariants}
                              initial="hidden"
                              whileInView="visible"
                              className="text-yellow-400 text-lg"
                            >
                              ⭐
                            </motion.div>
                          ))}
                        <span className="text-gray-400 text-sm ml-2">
                          {testimonial.stars}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial text */}
                  <motion.blockquote
                    className="text-gray-600 leading-relaxed text-lg relative"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <span className="absolute -left-2 -top-2 text-2xl text-purple-400 opacity-50">
                      "
                    </span>
                    {testimonial.text}
                    <span className="absolute -right-2 -bottom-2 text-2xl text-purple-400 opacity-50">
                      "
                    </span>
                  </motion.blockquote>

                  {/* Hover effect indicator */}
                  <motion.div
                    className="absolute bottom-4 right-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <svg
                      className="w-6 h-6"
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
                  </motion.div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

       
        

        
      </div>
    </motion.section>
  );
};

export default Testimonials;
