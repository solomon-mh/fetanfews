import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "../../utils/handleSearch";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { useNavigate, useSearchParams } from "react-router-dom";
import { calculateDistance } from "../../utils/calculations";
import { usePharmacyStore } from "../../store/usePharmacyStore";
import {
  FaMapMarkerAlt,
  FaPills,
  FaSort,
  FaSearch,
  FaTimesCircle,
} from "react-icons/fa";
import { RiMedicineBottleLine } from "react-icons/ri";
import { medicationType, pharmacyType } from "../../utils/interfaces";

const SearchResults: React.FC = () => {
  const setMedications = usePharmacyStore((state) => state.setMedications);
  const [sortBy, setSortBy] = useState<
    "distance" | "price" | "price+distance" | "none"
  >("none");
  const [searchParams] = useSearchParams();
  const [medication, pharmacy] = [
    searchParams.get("medication") ?? "",
    searchParams.get("pharmacy") ?? "",
  ];
  const [searchResults, setSearchResults] = useState<{
    type: string;
    data: pharmacyType[];
  }>({
    type: "none",
    data: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userLocation = useGeoLocation();

  const userCoordinates: [number, number] =
    userLocation.latitude && userLocation.longitude
      ? [userLocation.latitude, userLocation.longitude]
      : defaultCoordinates;
  const navigate = useNavigate();

  const handleClick = ({
    pharmacy,
  }: {
    pharmacy: { id: number; name: string; medications: medicationType[] };
  }) => {
    setMedications(pharmacy.medications || []);
    navigate(
      `/pharmacy/${encodeURIComponent(pharmacy.name)}?id=${pharmacy.id}`,
      {
        state: {
          fromSearch: true,
        },
      }
    );
  };

  useEffect(() => {
    if (!medication.trim() && !pharmacy.trim()) {
      setSearchResults({ type: "none", data: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    Search({ drugName: medication, pharmacyName: pharmacy })
      .then((results) => {
        setSearchResults(results);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Search error:", error);
        setIsLoading(false);
        setSearchResults({ type: "error", data: [] });
      });
  }, [medication, pharmacy, searchParams]);

  const sortedResults = [...searchResults.data];

  if (sortBy === "distance") {
    sortedResults.sort((a, b) => {
      const distA = calculateDistance(
        Number(a.latitude),
        Number(a.longitude),
        userCoordinates[0],
        userCoordinates[1]
      );
      const distB = calculateDistance(
        Number(b.latitude),
        Number(b.longitude),
        userCoordinates[0],
        userCoordinates[1]
      );
      return distA - distB;
    });
  } else if (sortBy === "price") {
    sortedResults.sort((a, b) => {
      const getLowestPrice = (pharmacy: pharmacyType): number => {
        if (!pharmacy.medications || pharmacy.medications.length === 0)
          return Infinity;
        const prices = pharmacy.medications
          .map((med: medicationType) => {
            const match = med.pharmacies?.find(
              (p: { id: number }) => p.id === pharmacy.id
            );
            return match?.price ?? Infinity;
          })
          .filter((price: number) => price !== Infinity);
        return prices.length > 0 ? Math.min(...prices) : Infinity;
      };

      return getLowestPrice(a) - getLowestPrice(b);
    });
  } else if (sortBy === "price+distance") {
    sortedResults.sort((a, b) => {
      const distA = calculateDistance(
        Number(a.latitude),
        Number(a.longitude),
        userCoordinates[0],
        userCoordinates[1]
      );
      const distB = calculateDistance(
        Number(b.latitude),
        Number(b.longitude),
        userCoordinates[0],
        userCoordinates[1]
      );
      const getLowestPrice = (pharmacy: pharmacyType): number => {
        if (!pharmacy.medications || pharmacy.medications.length === 0)
          return Infinity;
        const prices = pharmacy.medications
          .map((med: medicationType) => {
            const match = med.pharmacies?.find(
              (p: { id: number }) => p.id === pharmacy.id
            );
            return match?.price ?? Infinity;
          })
          .filter((price: number) => price !== Infinity);
        return prices.length > 0 ? Math.min(...prices) : Infinity;
      };
      const priceA = getLowestPrice(a);
      const priceB = getLowestPrice(b);

      return distA !== distB ? distA - distB : priceA - priceB;
    });
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="search-results-page px-4 md:px-10 space-y-8 text-gray-800 dark:text-gray-100 mx-auto"
    >
      {/* Search Summary */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-2xl py-2  font-bold flex items-center gap-2">
              <FaSearch className="text-indigo-600 text-3xl dark:text-indigo-400" />
              Search Results
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {medication && `Medication: ${medication}`} &nbsp;
              {pharmacy && `Pharmacy: ${pharmacy}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <FaSort className="text-gray-500 dark:text-gray-400" />
              <label className="font-medium">Sort by:</label>
            </div>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "distance" | "price" | "none")
              }
              className="border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="none">None</option>
              {searchParams.get("medication") && (
                <>
                  <option value="price">Price</option>
                  <option value="price+distance">Price+Distance</option>
                </>
              )}
              <option value="distance">Distance</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      <div>
        {/* Results List */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
              />
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Searching for {medication || pharmacy}...
              </p>
            </div>
          ) : searchResults.data.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <RiMedicineBottleLine className="text-indigo-600 dark:text-indigo-400" />
                {searchResults.data.length} result
                {searchResults.data.length > 1 ? "s" : ""} found
              </h2>

              <AnimatePresence>
                <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {searchResults.type === "pharmacy" &&
                    sortedResults?.map((pharmacy: pharmacyType, index) => (
                      <motion.button
                        key={pharmacy.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        className="block w-full text-left"
                        onClick={() => handleClick({ pharmacy })}
                      >
                        <div
                          className={`bg-white  ${
                            pharmacy?.medications?.length > 0 ? "h-64" : "h-24"
                          } dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all overflow-hidden"`}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold mb-2">
                              {pharmacy.name}
                            </h3>
                            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                              <FaMapMarkerAlt className="text-blue-500 dark:text-blue-400 text-xs" />
                              <span className="text-xs font-medium">
                                {calculateDistance(
                                  Number(pharmacy.latitude),
                                  Number(pharmacy.longitude),
                                  userCoordinates[0],
                                  userCoordinates[1]
                                ).toFixed(2)}{" "}
                                km
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {pharmacy.address}
                          </p>

                          {searchParams.get("medication") &&
                            pharmacy?.medications?.length > 0 && (
                              <ul className="space-y-2">
                                {pharmacy?.medications?.map(
                                  (med: medicationType, index: number) => {
                                    const matchedPharmacy =
                                      med?.pharmacies?.find(
                                        (p: { id: number }) =>
                                          p.id === pharmacy.id
                                      );
                                    return (
                                      <li
                                        key={index}
                                        className="flex items-center gap-2"
                                      >
                                        <FaPills className="text-emerald-500" />
                                        <span className="text-sm">
                                          {med.name} –{" "}
                                          {matchedPharmacy?.price ? (
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                              {matchedPharmacy?.price} Birr
                                            </span>
                                          ) : (
                                            <span className="text-gray-500">
                                              Price not available
                                            </span>
                                          )}
                                        </span>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            )}
                        </div>
                      </motion.button>
                    ))}
                  {searchResults.type === "medication" &&
                    sortedResults?.map((item: pharmacyType, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        className="block w-full text-left"
                        onClick={() => handleClick({ pharmacy: item })}
                      >
                        <div className="bg-white h-64 dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all overflow-hidden">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold mb-2">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                              <FaMapMarkerAlt className="text-blue-500 dark:text-blue-400 text-xs" />
                              <span className="text-xs font-medium">
                                {calculateDistance(
                                  Number(item.latitude),
                                  Number(item.longitude),
                                  userCoordinates[0],
                                  userCoordinates[1]
                                ).toFixed(2)}{" "}
                                km
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {item.address}
                          </p>

                          {item.medications?.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">
                                Available medications:
                              </h4>
                              <ul className="space-y-2">
                                {item.medications.map(
                                  (med: medicationType, index: number) => (
                                    <li
                                      key={index}
                                      className="flex items-center gap-2"
                                    >
                                      <FaPills className="text-emerald-500" />
                                      <span className="text-sm">
                                        {med.name} –{" "}
                                        {item.price ? (
                                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                            {item.price} Birr
                                          </span>
                                        ) : (
                                          <span className="text-gray-500">
                                            Price not available
                                          </span>
                                        )}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                </div>
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: 4 }}
              >
                <FaTimesCircle className="text-5xl text-red-400 dark:text-red-500 mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md">
                We couldn't find any {medication ? "medication" : "pharmacy"}{" "}
                matching your search. Please try different keywords.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SearchResults;
