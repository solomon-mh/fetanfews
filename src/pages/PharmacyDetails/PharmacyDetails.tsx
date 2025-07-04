/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { getPharmacyDetail } from "../../api/pharmacyService";
import PharmacyMap from "../../components/MapView/MapView";
import { FaSearch, FaHeartbeat, FaRedo } from "react-icons/fa";
import { searchPharmacyMedications } from "../../api/medicationService";
import defaultPharmacyImage from "../../assets/default-pharmacy.png";

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
  const [searchParams] = useSearchParams();
  const pharmacyId = searchParams.get("id");
  const [pharmacy, setPharmacy] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isOnsearch, setIsOnsearch] = useState(false);
  const [message, setMessage] = useState("");
  const { pharmacyName } = useParams();
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [searchSubmitted, setSearchSubmitted] = useState(false);

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
      } catch (err: any) {
        setError("Failed to fetch pharmacy details.");
        setLoading(false);
      }
    };

    fetchPharmacyDetails();
  }, [pharmacyId]);

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
      } catch (err) {
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
    return <p>Loading pharmacy details...</p>;
  }

  if (!pharmacy) {
    return <p>Pharmacy not found.</p>;
  }

  return (
    <div className="py-30 dark:bg-gray-800 dark:text-white">
      {" "}
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen px-4 py-6 sm:px-8 text-gray-800 dark:text-gray-100">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          {/* Left: Pharmacy Info */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-6">
            <div className="flex gap-4">
              <img
                src={`http://127.0.0.1:8000${pharmacy.image}`}
                alt={pharmacy.name}
                className="w-32 h-32 object-cover rounded-xl shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = defaultPharmacyImage;
                }}
              />
              <div>
                <h2 className="text-2xl font-bold mb-1">{pharmacy.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {calculateDistance(
                    pharmacy.latitude,
                    pharmacy.longitude,
                    userCoordinates[0],
                    userCoordinates[1]
                  ).toFixed(2)}{" "}
                  km away from you
                </p>
                <div className="mt-2 space-y-1 text-sm">
                  <p>📞 {pharmacy.phone}</p>
                  <p>📧 {pharmacy.email}</p>
                  <p>📍 {pharmacy.address}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-1 text-sm">
              {pharmacy.website && (
                <p>
                  🌐 Website:{" "}
                  <a
                    href={pharmacy.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {pharmacy.website}
                  </a>
                </p>
              )}
              <p>🕒 Hours: {pharmacy.operating_hours}</p>
              <p>
                🚚 Delivery:{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {pharmacy.delivery_available ? "Yes" : "No"}
                </span>
              </p>
            </div>
          </div>

          {/* Right: Map */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">
              <span className="text-blue-600 underline">{pharmacyName}</span> on
              Map
            </h3>
            {userLocation.latitude && userLocation.longitude ? (
              <PharmacyMap
                userCoordinates={userCoordinates}
                pharmacies={[pharmacy]}
                userLocationError={userLocation.error}
              />
            ) : (
              <p className="text-sm text-gray-500">
                Please enable location services to view the map.
              </p>
            )}
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Search medications or categories"
              className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            />
            <button
              onClick={() => handleSearch("")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <FaSearch />
            </button>
          </div>

          {!searchTerm.trim() && !isOnsearch && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>
                💊 Search a medication or browse categories at{" "}
                <strong className="text-blue-600">{pharmacyName}</strong>
              </p>
              <p className="mt-2">Popular meds:</p>
              <ul className="flex gap-3 mt-1 flex-wrap">
                {["Paracetamol", "Ibuprofen", "Amoxicillin", "Aspirin"].map(
                  (item) => (
                    <li
                      key={item}
                      onClick={() => handleSearch(item)}
                      className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md cursor-pointer hover:bg-blue-600 hover:text-white transition text-sm"
                    >
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {isOnsearch && (
            <div className="flex gap-2 items-center text-blue-600 dark:text-blue-400">
              <FaHeartbeat className="animate-pulse" />
              <p>Searching... Please wait</p>
            </div>
          )}

          {searchTerm && searchResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Search Results</h3>
              <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    <tr>
                      <th className="px-4 py-2">Drug Name</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((med) => (
                      <tr
                        key={med.id}
                        className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-2">{med.name}</td>
                        <td className="px-4 py-2">{med.pivot.price} Birr</td>
                        <td className="px-4 py-2">
                          <Link
                            to={`/pharmacy/${encodeURIComponent(
                              pharmacy.name
                            )}/${encodeURIComponent(med.name)}?pham_id=${
                              pharmacy.id
                            }&med_id=${med.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            See Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {searchSubmitted && searchResults.length < 1 && (
            <div className="text-sm text-red-600 dark:text-red-400 space-y-2">
              <p>Sorry, Medication Not Found.</p>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-4 py-1 rounded-md hover:bg-red-200 dark:hover:bg-red-700"
              >
                <FaRedo />
                Retry Search
              </button>
            </div>
          )}

          {(message || error) && !isOnsearch && (
            <div className="text-sm text-red-600 dark:text-red-400 space-y-2">
              <p>{message || error}</p>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-4 py-1 rounded-md hover:bg-red-200 dark:hover:bg-red-700"
              >
                <FaRedo />
                Retry Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetailPage;
