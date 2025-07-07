/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  getNearbyPharmacies,
  fetchPharmacyData,
} from "../../api/pharmacyService";
import PharmacyList from "../../components/PharmacyList/PharmacyList";
import { calculateDistance } from "../../utils/calculations";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";

const NearbyPharmacies: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedRange, setSelectedRange] = useState<{
    lower: number;
    upper: number;
  }>({ lower: 0, upper: 5 });
  const [error, setError] = useState<string | null>(null);

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
    { label: "Less than 1 km", lower: 0, upper: 1 },
    { label: "1 km - 3 km", lower: 1, upper: 3 },
    { label: "3 km - 5 km", lower: 3, upper: 5 },
    { label: "5 km and above", lower: 5, upper: 100 }, // 100 acts as an upper bound
  ];
  useEffect(() => {
    const loadPharmacies = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPharmacyData();
        setSearchResults(data);
      } catch (err: any) {
        setError("Failed to load pharmacies");
      } finally {
        setIsLoading(false);
      }
    };

    loadPharmacies();
  }, []);

  useEffect(() => {
    const fetchNearbyPharmacies = async (
      lower_limit: number,
      upper_limit: number
    ) => {
      if (userLocation.latitude && userLocation.longitude) {
        setIsLoading(true);
        const results = await getNearbyPharmacies(
          userCoordinates[0],
          userCoordinates[1],
          lower_limit,
          upper_limit
        );
        setSearchResults(results);
        setIsLoading(false);
      }
    };
    fetchNearbyPharmacies(selectedRange.lower, selectedRange.upper);
  }, [
    selectedRange,
    userCoordinates,
    userLocation.latitude,
    userLocation.longitude,
  ]);
  console.log(userCoordinates, userLocation);

  if (error) {
    return (
      <div className="error-message">
        <h3>Error:</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="nearby-pharmacies py-20 px-4 md:px-10 bg-gray-50 dark:bg-gray-900 min-h-screen transition-all">
      {/* Distance Filter */}
      <div className="max-w-4xl mx-auto mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
          Filter Pharmacies by Distance
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {distanceOptions.map((option) => (
              <label
                key={`${option.lower}-${option.upper}`}
                className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
              >
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
                  className="accent-blue-500"
                />
                <span className="text-sm text-gray-800 dark:text-gray-100">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          <div className="text-right">
            <button
              onClick={() => setSelectedRange({ lower: 0, upper: 5 })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Reset Distance
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        {isLoading ? (
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg">
            Loading nearby pharmacies...
          </p>
        ) : searchResults.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {searchResults.length} pharmacies found
            </h2>
            <PharmacyList
              pharmacies={searchResults}
              calculateDistance={calculateDistance}
              showAllButton={true}
            />
          </>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No results found. Try a different range.
          </p>
        )}
      </div>
    </div>
  );
};

export default NearbyPharmacies;
