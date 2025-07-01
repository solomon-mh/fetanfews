import React, { useRef } from "react";
import { FaMapMarkerAlt, FaClock, FaMedkit, FaSearch } from "react-icons/fa";
import { cardVariants } from "../../utils/animateVariant";
import { motion, useInView } from "framer-motion";
const WhyUseFetanfews: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true, // Trigger only once
  });
  const benefits = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Locate Nearby Pharmacies",
      description:
        "Find pharmacies near you quickly with accurate location details.",
    },
    {
      icon: <FaClock />,
      title: "Save Time",
      description:
        "Get instant access to pharmacy information and available medicines.",
    },
    {
      icon: <FaMedkit />,
      title: "Comprehensive Drug Data",
      description:
        "Access a wide range of medications, categorized for your convenience.",
    },
    {
      icon: <FaSearch />,
      title: "Effortless Search",
      description:
        "Easily search by medication category or pharmacy name with advanced filters.",
    },
  ];

  return (
    <section className="why-use-medlocator px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
        Why Use FetanFews?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            ref={ref}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition duration-75 ease-in-out flex flex-col items-center text-center"
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover="hover"
            transition={{ duration: 0.5 }}
          >
            <div className="icon-container text-lime-600 dark:text-lime-400 text-4xl mb-4">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {benefit.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyUseFetanfews;
