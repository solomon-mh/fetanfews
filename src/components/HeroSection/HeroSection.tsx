import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { fetchMostSearchedMedications } from "../../api/medicationService";
import { medicationType } from "../../utils/interfaces";
import SearchResults from "../SearchResults/SearchResults";
import SearchBar from "../SearchBar/SearchBar";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaPills,
  FaArrowRight,
} from "react-icons/fa";
import { RiMedicineBottleFill } from "react-icons/ri";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const [frequentlySearchedDrugs, setFrequentlySearchedDrugs] = useState<
    medicationType[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleDrugSearch = (drug: string) => {
    if (drug) queryParams.set("medication", drug);
    navigate(`?${queryParams.toString()}`);
  };

  useEffect(() => {
    const getMedications = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMostSearchedMedications();
        setFrequentlySearchedDrugs(data);
      } catch (error) {
        console.error("Error fetching medications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getMedications();
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        className="absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-400 blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-green-400 blur-3xl opacity-30"></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-full"
              >
                <RiMedicineBottleFill className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                  Your Health, Our Priority
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 dark:from-lime-300 dark:to-emerald-400"
              >
                Find Medications & Pharmacies Near You
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-xl"
              >
                We connect you with the medications you need and the pharmacies
                that have them, ensuring you get your prescriptions quickly and
                conveniently.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="max-w-xl"
            >
              <SearchBar />
            </motion.div>

            <AnimatePresence>
              {(queryParams.get("medication") ||
                queryParams.get("pharmacy")) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SearchResults />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/nearby-pharmacies/"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <FaMapMarkerAlt />
                  Find Nearby Pharmacies
                  <FaArrowRight className="ml-1" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <FaPills />
                  Explore Services
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Frequently Searched Drugs */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2"
            >
              <FaSearch className="text-indigo-600 dark:text-indigo-400" />
              Popular Medications
            </motion.h2>

            {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full"
                  />
                ))}
              </div>
            ) : frequentlySearchedDrugs.length > 0 ? (
              <motion.ul className="grid grid-cols-2 gap-3">
                {frequentlySearchedDrugs.map((drug, index) => (
                  <motion.li
                    key={drug.id ?? index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDrugSearch(drug.name)}
                    className="cursor-pointer flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all"
                  >
                    <FaPills className="text-indigo-500 dark:text-indigo-400" />
                    <span className="text-sm font-medium">{drug.name}</span>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-500 dark:text-gray-400"
              >
                No frequently searched medications found
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
