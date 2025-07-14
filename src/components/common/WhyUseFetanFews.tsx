import React, { useRef } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaMedkit,
  FaSearch,
  FaHeartbeat,
  FaShieldAlt,
  FaExchangeAlt,
} from "react-icons/fa";
import { motion, useInView, stagger, animate } from "framer-motion";

const WhyUseFetanfews: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const benefits = [
    {
      icon: <FaMapMarkerAlt className="text-3xl" />,
      title: "Locate Nearby Pharmacies",
      description:
        "Find pharmacies near you quickly with accurate location details and real-time availability.",
      color: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <FaClock className="text-3xl" />,
      title: "Save Precious Time",
      description:
        "Get instant access to pharmacy information, operating hours, and medicine availability without waiting in line.",
      color: "text-emerald-500 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      icon: <FaMedkit className="text-3xl" />,
      title: "Comprehensive Drug Database",
      description:
        "Access detailed information on thousands of medications, including dosage, side effects, and alternatives.",
      color: "text-purple-500 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: <FaSearch className="text-3xl" />,
      title: "Smart Search System",
      description:
        "Find exactly what you need with our advanced search filters by medication, category, or pharmacy.",
      color: "text-amber-500 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: <FaHeartbeat className="text-3xl" />,
      title: "Health First Approach",
      description:
        "Verified information from licensed pharmacies to ensure you get safe, authentic medications.",
      color: "text-red-500 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      icon: <FaExchangeAlt className="text-3xl" />,
      title: "Seamless Experience",
      description:
        "Easy transfers between branches and partner pharmacies when your medication isn't available locally.",
      color: "text-indigo-500 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
  };

  return (
    <section
      ref={ref}
      className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 dark:from-lime-300 dark:to-emerald-400">
            Why Choose FetanFews?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transforming how you access pharmacy services with innovative
            technology and patient-focused solutions
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className={`${benefit.bgColor} rounded-2xl p-8 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all`}
            >
              <div className={`${benefit.color} mb-6 flex justify-center`}>
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {benefit.icon}
                </motion.div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 text-center">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join thousands of satisfied users who have transformed their
            pharmacy experience
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUseFetanfews;
