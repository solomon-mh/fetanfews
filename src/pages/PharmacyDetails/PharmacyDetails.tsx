import { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  Link,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { getPharmacyDetail } from "../../api/pharmacyService";
import PharmacyMap from "../../components/MapView/MapView";
import {
  FaSearch,
  FaHeartbeat,
  FaRedo,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaClock,
  FaTruck,
} from "react-icons/fa";
import { RiMedicineBottleLine } from "react-icons/ri";
import { searchPharmacyMedications } from "../../api/medicationService";
import defaultPharmacyImage from "../../assets/default-pharmacy.png";
import { usePharmacyStore } from "../../store/usePharmacyStore";
import { PharmacyDataType, medicationType } from "../../utils/interfaces";

interface PharmacyDetailPageProps {
  calculateDistance: (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => number;
}

const PharmacyDetailPage: React.FC<PharmacyDetailPageProps> = ({
  calculateDistance,
}) => {
  const medications = usePharmacyStore((state) => state.medications);
  const clearMedications = usePharmacyStore((state) => state.clearMedications);
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const pharmacyId = searchParams.get("id");
  const [pharmacy, setPharmacy] = useState<PharmacyDataType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<medicationType[]>([]);
  const [isOnsearch, setIsOnsearch] = useState(false);
  const [message, setMessage] = useState("");
  const { pharmacyName } = useParams();
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [, setSearchSubmitted] = useState(false);

  const userLocation = useGeoLocation();
  const userCoordinates: [number, number] =
    userLocation.latitude && userLocation.longitude
      ? [userLocation.latitude, userLocation.longitude]
      : defaultCoordinates;

  // Fetch pharmacy data from API
  useEffect(() => {
    const fetchPharmacyDetails = async () => {
      try {
        if (pharmacyId) {
          const response = await getPharmacyDetail(pharmacyId);
          setPharmacy(response.data);
          setLoading(false);
        } else {
          setError("Pharmacy ID is not defined.");
          setLoading(false);
        }
      } catch {
        setError("Failed to fetch pharmacy details.");
        setLoading(false);
      }
    };

    fetchPharmacyDetails();

    const cameFromSearch = location.state?.fromSearch;
    if (!cameFromSearch) {
      clearMedications();
    }
  }, [pharmacyId, location, clearMedications]);

  // Function to handle medication search
  const handleSearch = async (term = "") => {
    if (term) {
      setSearchTerm(term);
      setTriggerSearch(true);
      setSearchSubmitted(true);
    } else if (!searchTerm.trim()) {
      setError("Please enter a search term");
      setSearchResults([]);
      return;
    } else {
      setTriggerSearch(true);
    }
  };

  useEffect(() => {
    if (!triggerSearch || !searchTerm.trim()) return;

    const searchMedications = async () => {
      setIsOnsearch(true);
      setMessage("");
      setError("");
      setSearchResults([]);

      try {
        if (pharmacyId) {
          const result = await searchPharmacyMedications(
            pharmacyId,
            searchTerm
          );
          // Handle empty results
          if (Array.isArray(result)) {
            if (result.length === 0) {
              setMessage("No medications found matching your search");
            } else {
              setSearchResults(result);
            }
          } else if (result.message) {
            setMessage(result.message);
          } else if (result.error) {
            setError(result.error);
            setSearchResults([]);
          } else {
            setError("");
            setSearchResults(result);
          }
        } else {
          setError("Pharmacy ID is not defined.");
        }
      } catch {
        setError("An error occurred while searching. Please try again.");
      }

      setIsOnsearch(false);
      setTriggerSearch(false); // Reset trigger
    };

    searchMedications();
  }, [searchTerm, pharmacyId, triggerSearch]);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setMessage("");
    setSearchSubmitted(false);
    setSearchTerm(event.target.value);
  };

  const handleRetry = () => {
    setSearchTerm("");
    setIsOnsearch(false);
    setMessage("");
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Pharmacy not found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The pharmacy you're looking for doesn't exist or may have been
            removed.
          </p>
          <Link
            to="/"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Pharmacy Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-10"
        >
          <div className="grid md:grid-cols-3 gap-6 p-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-xl h-64 md:h-full"
            >
              <img
                src={pharmacy.image}
                alt={pharmacy.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = defaultPharmacyImage;
                }}
              />
            </motion.div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {pharmacy.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-blue-600 dark:text-blue-400">
                    <FaMapMarkerAlt />
                    <span>
                      {calculateDistance(
                        pharmacy.latitude,
                        pharmacy.longitude,
                        userCoordinates[0],
                        userCoordinates[1]
                      ).toFixed(2)}{" "}
                      km away
                    </span>
                  </div>
                </div>

                <div className="bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full text-indigo-800 dark:text-indigo-200 text-sm font-medium">
                  {pharmacy.delivery_available
                    ? "Delivery Available"
                    : "In-Store Only"}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                    <FaPhone className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>{pharmacy.phone}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                    <FaEnvelope className="text-green-600 dark:text-green-400" />
                  </div>
                  <span>{pharmacy.email}</span>
                </div>

                {pharmacy.website && (
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
                      <FaGlobe className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <a
                      href={pharmacy.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {pharmacy.website}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                    <FaClock className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <span>{pharmacy.operating_hours}</span>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Address:</span>{" "}
                  {pharmacy.address}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Medications */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <RiMedicineBottleLine className="text-indigo-600 dark:text-indigo-400" />
                Search Medications
              </h2>

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Search medications..."
                  className="w-full p-4 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSearch("")}
                  className="absolute right-2 top-2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FaSearch />
                </motion.button>
              </div>

              {!searchTerm.trim() && !isOnsearch && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4"
                >
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Popular medications at {pharmacyName}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Paracetamol", "Ibuprofen", "Amoxicillin", "Aspirin"].map(
                      (item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSearch(item)}
                          className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full cursor-pointer text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all"
                        >
                          {item}
                        </motion.div>
                      )
                    )}
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {isOnsearch && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 mt-4 text-indigo-600 dark:text-indigo-400"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <FaHeartbeat />
                    </motion.div>
                    <span>Searching medications...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {(message || error) && !isOnsearch && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`mt-4 p-4 rounded-lg ${
                      error
                        ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                        : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p>{message || error}</p>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleRetry}
                        className="flex items-center gap-1 text-sm"
                      >
                        <FaRedo />
                        Retry
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {(medications?.length > 0 || searchResults.length > 0) && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <RiMedicineBottleLine className="text-indigo-600 dark:text-indigo-400" />
                      {searchResults.length > 0
                        ? "Search Results"
                        : "Available Medications"}
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Medication
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        <AnimatePresence>
                          {(searchResults.length > 0
                            ? searchResults
                            : medications
                          ).map((med, index) => {
                            const matchedPharmacy = (
                              med?.pharmacies || []
                            ).find((p: { id: number }) => p.id === pharmacy.id);
                            return (
                              <motion.tr
                                key={med.id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                  {med.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {searchResults.length > 0 &&
                                  med?.pivot?.price ? (
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                      {med.pivot.price} Birr
                                    </span>
                                  ) : matchedPharmacy?.price ? (
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                      {matchedPharmacy.price} Birr
                                    </span>
                                  ) : (
                                    "Not available"
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  <Link
                                    to={`/pharmacy/${encodeURIComponent(
                                      pharmacy.name
                                    )}/${encodeURIComponent(
                                      med.name
                                    )}?pham_id=${pharmacy.id}&med_id=${med.id}`}
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                  >
                                    View Details
                                  </Link>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          <div className="bg-white h-64 dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FaTruck className="text-indigo-600 dark:text-indigo-400" />
                Delivery Information
              </h3>
            </div>
            <div className="p-6">
              {pharmacy.delivery_available ? (
                <div className="space-y-3">
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    ✓ Delivery Available
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    This pharmacy offers delivery services within a{" "}
                    {calculateDistance(
                      pharmacy.latitude,
                      pharmacy.longitude,
                      userCoordinates[0],
                      userCoordinates[1]
                    ).toFixed(2)}{" "}
                    km radius.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Delivery hours: {pharmacy.operating_hours}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    This pharmacy currently does not offer delivery services.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Right Column - Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-8"
        >
          <div className="bg-white my-6 dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-600 dark:text-indigo-400" />
                Pharmacy Location
              </h3>
            </div>
            <div className="p-4 h-96">
              {userLocation.latitude && userLocation.longitude ? (
                <PharmacyMap
                  userCoordinates={userCoordinates}
                  pharmacies={[pharmacy]}
                  userLocationError={userLocation.error}
                  centerCoordinates={[
                    Number(pharmacy.latitude),
                    Number(pharmacy.longitude),
                  ]}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <FaMapMarkerAlt className="text-4xl text-yellow-500 dark:text-yellow-400 mb-3" />
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    Location Services Required
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Please enable location services to view the pharmacy on map
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PharmacyDetailPage;
