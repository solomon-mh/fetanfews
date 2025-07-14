import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const PharmacyHelp: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [hoverState, setHoverState] = useState<number | null>(null);

  const slides = [
    {
      title: "Benefits of Registration",
      content: (
        <ul className="list-disc list-inside space-y-3">
          {[
            "Get discovered by nearby users",
            "Enable delivery for wider access",
            "Show real-time drug availability",
            "Reduce phone inquiries with clear info",
            "Access customer search analytics",
          ].map((item, i) => (
            <motion.li
              key={i}
              className="relative pl-5 py-1"
              onHoverStart={() => setHoverState(i)}
              onHoverEnd={() => setHoverState(null)}
            >
              <motion.span
                className="relative z-10"
                animate={{
                  color:
                    hoverState === i
                      ? ["#059669", "#10b981"]
                      : ["#374151", "#9ca3af"],
                }}
                transition={{ duration: 0.3 }}
              >
                {item}
              </motion.span>
              <motion.div
                className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-full"
                initial={{ scaleY: 0 }}
                animate={{
                  scaleY: hoverState === i ? 1 : 0,
                  backgroundColor:
                    hoverState === i
                      ? ["#10b981", "#34d399"]
                      : ["#10b981", "#10b981"],
                }}
                transition={{
                  scaleY: { duration: 0.3 },
                  backgroundColor: {
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                }}
              />
            </motion.li>
          ))}
        </ul>
      ),
    },
    {
      title: "Premium Features",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: "🆓", text: "Basic registration is free" },
            { icon: "⭐", text: "Priority listing" },
            { icon: "📊", text: "Monthly analytics" },
            { icon: "🔝", text: "Featured placements" },
            { icon: "🔒", text: "Secure payments" },
            { icon: "📈", text: "Promotion tools" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-4 rounded-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.text}
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "How to Register",
      content: (
        <div className="space-y-5">
          <div className="relative">
            {[
              "Fill out the registration form",
              "Upload pharmacy logo (optional)",
              "Provide detailed address",
              "Submit and verify",
            ].map((step, i) => (
              <motion.div
                key={i}
                className="flex items-start mb-4 last:mb-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex-shrink-0 mt-1 mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white font-bold">
                    {i + 1}
                  </div>
                </div>
                <div className="text-gray-700 dark:text-gray-300">{step}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <Link
              to="/pharmacy-registration/form"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-full shadow-lg transition-all duration-300 group"
            >
              <span className="mr-2">Get Started Now</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  repeatDelay: 2,
                }}
              >
                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      ),
    },
  ];

  const handlePrev = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === "right" ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
    exit: (direction: string) => ({
      x: direction === "right" ? -50 : 50,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800 dark:from-lime-300 dark:to-lime-500">
            Pharmacy Registration
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Everything you need to know to join our network
          </p>
        </motion.div>

        <div className="relative">
          {/* Navigation Arrows */}
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 p-3 rounded-full bg-white/10 backdrop-blur border border-white/20 dark:border-gray-700/50 text-green-500 dark:text-lime-300 shadow-lg transition-all"
            disabled={currentIndex === 0}
            style={{ backdropFilter: "blur(10px)" }}
          >
            <FaChevronLeft size={18} />
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-3 rounded-full bg-white/10 backdrop-blur border border-white/20 dark:border-gray-700/50 text-green-500 dark:text-lime-300 shadow-lg transition-all"
            disabled={currentIndex === slides.length - 1}
            style={{ backdropFilter: "blur(10px)" }}
          >
            <FaChevronRight size={18} />
          </motion.button>

          {/* Slides */}
          <div className="relative h-auto min-h-[400px]">
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/30 dark:border-gray-700/50 overflow-hidden"
                  style={{
                    boxShadow: "0 10px 30px -10px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  {/* Glow effect */}
                  <motion.div
                    className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-green-400/20 blur-3xl"
                    animate={{
                      x: [0, 20, 0],
                      y: [0, 20, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />

                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl font-bold mb-5 text-green-600 dark:text-lime-400 flex items-center"
                  >
                    <span className="mr-2">{slides[currentIndex].title}</span>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    >
                      👋
                    </motion.div>
                  </motion.h3>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {slides[currentIndex].content}
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-8 space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="focus:outline-none"
              >
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  className="w-3 h-3 rounded-full relative"
                  animate={{
                    backgroundColor:
                      index === currentIndex
                        ? ["#10b981", "#34d399", "#10b981"]
                        : ["#e5e7eb", "#9ca3af"],
                  }}
                  transition={{
                    backgroundColor: {
                      duration: 2,
                      repeat: Infinity,
                    },
                  }}
                >
                  {index === currentIndex && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-green-400/30"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </motion.div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyHelp;
