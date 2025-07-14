import { Link } from "react-router-dom";
import { PharmacyListProps } from "../../utils/interfaces";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import defaultPharmacyImage from "../../assets/default-pharmacy.png";
import {
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  // FaStar,
} from "react-icons/fa";
import { RiMedicineBottleLine } from "react-icons/ri";

const PharmacyList: React.FC<PharmacyListProps> = ({
  pharmacies,
  calculateDistance,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [, setHoveredCard] = useState<number | null>(null);

  const userLocation = useGeoLocation();
  const userCoordinates: [number, number] =
    userLocation.latitude && userLocation.longitude
      ? [userLocation.latitude, userLocation.longitude]
      : defaultCoordinates;

  // Sort pharmacies by distance
  const sortedPharmacies = [...pharmacies].sort((a, b) => {
    const distanceA = calculateDistance(
      a.latitude,
      a.longitude,
      userCoordinates[0],
      userCoordinates[1]
    );
    const distanceB = calculateDistance(
      b.latitude,
      b.longitude,
      userCoordinates[0],
      userCoordinates[1]
    );
    return distanceA - distanceB;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedPharmacies = sortedPharmacies.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(pharmacies.length / itemsPerPage);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -10,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
  };

  return (
    <div className="pharmacies-list-wrapper bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 py-12">
      <div className="px-12 lg:px-32 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <RiMedicineBottleLine className="text-indigo-600 dark:text-indigo-400" />
              Nearby Pharmacies
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Showing {displayedPharmacies.length} of {pharmacies.length}{" "}
              pharmacies
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FaMapMarkerAlt className="text-blue-500" />
            <span>
              {userLocation.latitude ? "Your location" : "Default location"}
            </span>
          </div>
        </motion.div>

        {/* Pharmacy Cards Grid */}
        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {displayedPharmacies.map((pharmacy, index) => (
              <motion.li
                key={pharmacy.id}
                className="pharmacy-item relative"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onHoverStart={() => setHoveredCard(pharmacy.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
                <div className="h-full bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all overflow-hidden">
                  {/* Pharmacy Image */}
                  <div className="relative overflow-hidden rounded-lg mb-4 h-48">
                    <img
                      src={pharmacy.image || defaultPharmacyImage}
                      alt={pharmacy.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = defaultPharmacyImage;
                      }}
                    />
                    {/* Rating Badge */}
                    {/* {pharmacy?.rating && (
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                        <FaStar className="text-yellow-500" />
                        <span>{pharmacy?.rating}</span>
                      </div>
                    )} */}
                  </div>

                  {/* Pharmacy Info */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <Link
                        to={`/pharmacy/${encodeURIComponent(
                          pharmacy.name
                        )}?id=${pharmacy.id}`}
                        className="hover:underline"
                      >
                        {pharmacy.name}
                      </Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                      {pharmacy.address}
                    </p>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                        <FaMapMarkerAlt className="text-blue-500 dark:text-blue-400 text-xs" />
                        <span className="text-xs font-medium">
                          {calculateDistance(
                            pharmacy.latitude,
                            pharmacy.longitude,
                            userCoordinates[0],
                            userCoordinates[1]
                          ).toFixed(2)}{" "}
                          km
                        </span>
                      </div>
                      <Link
                        to={`/pharmacy/${encodeURIComponent(
                          pharmacy.name
                        )}?id=${pharmacy.id}`}
                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center mt-12 gap-4"
          >
            <motion.button
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-600"
              } transition-all`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft className="text-sm" />
              <span>Previous</span>
            </motion.button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                    } transition-colors`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </motion.button>
                )
              )}
            </div>

            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-600"
              } transition-all`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <FaChevronRight className="text-sm" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PharmacyList;
