import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getNearbyPharmacies,
  fetchPharmacyData,
} from "../../api/pharmacyService";
import PharmacyList from "../../components/PharmacyList/PharmacyList";
import { calculateDistance } from "../../utils/calculations";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { FiRefreshCw, FiMapPin, FiAlertCircle } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { PharmacyDataType } from "../../utils/interfaces";

const NearbyPharmacies: React.FC = () => {
  const [searchResults, setSearchResults] = useState<PharmacyDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedRange, setSelectedRange] = useState<{
    lower: number;
    upper: number;
  }>({ lower: 0, upper: 5 });
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userLocation = useGeoLocation();
  const userCoordinates: [number, number] = React.useMemo(
    () =>
      userLocation.latitude && userLocation.longitude
        ? [userLocation.latitude, userLocation.longitude]
        : defaultCoordinates,
    [userLocation.latitude, userLocation.longitude]
  );

  // Define distance range options dynamically
  const distanceOptions = [
    {
      label: "Under 1 km",
      lower: 0,
      upper: 1,
      icon: <FaMapMarkerAlt className="text-blue-500" />,
    },
    {
      label: "1-3 km",
      lower: 1,
      upper: 3,
      icon: <FaMapMarkerAlt className="text-green-500" />,
    },
    {
      label: "3-5 km",
      lower: 3,
      upper: 5,
      icon: <FaMapMarkerAlt className="text-yellow-500" />,
    },
    {
      label: "5+ km",
      lower: 5,
      upper: 100000,
      icon: <FaMapMarkerAlt className="text-red-500" />,
    },
  ];

  const loadPharmacies = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPharmacyData();
      setSearchResults(data);
    } catch {
      setError("Failed to load pharmacies");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNearbyPharmacies = async (lower: number, upper: number) => {
    if (userLocation.latitude && userLocation.longitude) {
      setIsLoading(true);
      try {
        const results = await getNearbyPharmacies(
          userCoordinates[0],
          userCoordinates[1],
          lower,
          upper
        );
        setSearchResults(results);
      } catch {
        setError("Failed to fetch nearby pharmacies");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNearbyPharmacies(selectedRange.lower, selectedRange.upper);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    loadPharmacies();
  }, []);

  useEffect(() => {
    fetchNearbyPharmacies(selectedRange.lower, selectedRange.upper);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRange, userCoordinates]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="error-message flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-800 p-6"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <FiAlertCircle className="text-5xl text-red-500" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Error
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="nearby-pharmacies py-20 px-4 md:px-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen"
    >
      {/* Distance Filter */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto mb-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Nearby Pharmacies
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find pharmacies near your current location
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <motion.span
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FiRefreshCw
                className={`${
                  isRefreshing ? "text-blue-500" : "text-gray-500"
                }`}
              />
            </motion.span>
            <span className="text-sm font-medium">Refresh</span>
          </motion.button>
        </div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
          whileHover={{ y: -2 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Filter by distance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {distanceOptions.map((option) => (
              <motion.label
                key={`${option.lower}-${option.upper}`}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all ${
                  selectedRange.lower === option.lower &&
                  selectedRange.upper === option.upper
                    ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 shadow-inner"
                    : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                }`}
              >
                <div className="mb-2 text-xl">{option.icon}</div>
                <input
                  type="radio"
                  name="distance"
                  value={`${option.lower}-${option.upper}`}
                  checked={
                    selectedRange.lower === option.lower &&
                    selectedRange.upper === option.upper
                  }
                  onChange={() =>
                    setSelectedRange({
                      lower: option.lower,
                      upper: option.upper,
                    })
                  }
                  className="hidden"
                />
                <span className="text-sm font-medium text-center text-gray-800 dark:text-gray-100">
                  {option.label}
                </span>
              </motion.label>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Search Results */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-6xl mx-auto"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
            />
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Finding pharmacies near you...
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <motion.div
              className="flex justify-between items-center mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {searchResults.length} pharmacies found within{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {selectedRange.lower}-{selectedRange.upper} km
                </span>
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FiMapPin className="text-blue-500" />
                <span>
                  {userLocation.latitude ? "Your location" : "Default location"}
                </span>
              </div>
            </motion.div>

            <AnimatePresence>
              <PharmacyList
                pharmacies={searchResults}
                calculateDistance={calculateDistance}
                showAllButton={true}
              />
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-center shadow-sm"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <FiMapPin className="text-5xl text-gray-400 dark:text-gray-500" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No Pharmacies Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mb-4">
              We couldn't find any pharmacies within {selectedRange.lower}-
              {selectedRange.upper} km of your location.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedRange({ lower: 0, upper: 10000 })}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Show All Pharmacies
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default NearbyPharmacies;
