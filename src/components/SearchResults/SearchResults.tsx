/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// import { calculateDistance } from "../../utils/calculations";
import { Search } from "../../utils/handleSearch";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import PharmacyMap from "../../components/MapView/MapView";
import { useNavigate, useSearchParams } from "react-router-dom";
import { calculateDistance } from "../../utils/calculations";
import { usePharmacyStore } from "../../store/usePharmacyStore";

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
    data: any[];
  }>({
    type: "none",
    data: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userLocation = useGeoLocation();
  // const [visibleCount, setVisibleCount] = useState(5);

  const userCoordinates: [number, number] =
    userLocation.latitude && userLocation.longitude
      ? [userLocation.latitude, userLocation.longitude]
      : defaultCoordinates;
  const navigate = useNavigate();
  const handleClick = ({
    pharmacy,
  }: {
    pharmacy: { id: number; name: string; medications: any[] };
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
  // const handleShowAll = () => {
  //   setVisibleCount(searchResults.data.length);
  // };
  const sortedResults = [...searchResults.data];

  if (sortBy === "distance") {
    sortedResults.sort((a, b) => {
      const distA = calculateDistance(
        a.latitude,
        a.longitude,
        userCoordinates[0],
        userCoordinates[1]
      );
      const distB = calculateDistance(
        b.latitude,
        b.longitude,
        userCoordinates[0],
        userCoordinates[1]
      );
      return distA - distB;
    });
  } else if (sortBy === "price") {
    sortedResults.sort((a, b) => {
      const getLowestPrice = (pharmacy: any): number => {
        if (!pharmacy.medications || pharmacy.medications.length === 0)
          return Infinity;
        const prices = pharmacy.medications
          .map((med: any) => {
            const match = med.pharmacies?.find(
              (p: any) => p.id === pharmacy.id
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
        a.latitude,
        a.longitude,
        userCoordinates[0],
        userCoordinates[1]
      );
      const distB = calculateDistance(
        b.latitude,
        b.longitude,
        userCoordinates[0],
        userCoordinates[1]
      );
      const getLowestPrice = (pharmacy: any): number => {
        if (!pharmacy.medications || pharmacy.medications.length === 0)
          return Infinity;
        const prices = pharmacy.medications
          .map((med: any) => {
            const match = med.pharmacies?.find(
              (p: any) => p.id === pharmacy.id
            );
            return match?.price ?? Infinity;
          })
          .filter((price: number) => price !== Infinity);
        return prices.length > 0 ? Math.min(...prices) : Infinity;
      };
      const priceA = getLowestPrice(a);
      const priceB = getLowestPrice(b);

      // Sort by distance first, then by price
      return distA !== distB ? distA - distB : priceA - priceB;
    });
  }

  return (
    <div className="search-results-page px-4 md:px-10 py-6 space-y-6 text-gray-800 dark:text-gray-100">
      <div className="mb-4">
        <label className="mr-2 font-medium">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "distance" | "price" | "none")
          }
          className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white"
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
      <div className="search-results-wrapper">
        <div className="search-results">
          {isLoading ? (
            <p className="text-xl animate-pulse">🔎 Searching...</p>
          ) : searchResults.data.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">
                {searchResults.data.length} result
                {searchResults.data.length > 1 ? "s" : ""} found
              </h2>
              <div className="space-y-6">
                {searchResults.type === "pharmacy" &&
                  sortedResults?.map((pharmacy: any, index) => (
                    <button
                      className="block w-full text-left"
                      key={index}
                      onClick={() => handleClick({ pharmacy })}
                    >
                      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border dark:border-gray-700">
                        <h3 className="text-xl font-semibold mb-2">
                          {pharmacy.name}
                        </h3>
                        <p>{pharmacy.address}</p>
                        <p>
                          Distance of:&nbsp;
                          <strong>
                            {calculateDistance(
                              pharmacy.latitude,
                              pharmacy.longitude,
                              userCoordinates[0],
                              userCoordinates[1]
                            ).toFixed(2)}{" "}
                            Km
                          </strong>
                        </p>
                        {searchParams.get("medication") &&
                          pharmacy?.medications?.length > 0 && (
                            <ul className="list-disc list-inside ml-4">
                              {pharmacy?.medications?.map(
                                (med: any, index: number) => {
                                  const matchedPharmacy = med?.pharmacies?.find(
                                    (p: any) => p.id === pharmacy.id
                                  );
                                  return (
                                    <li key={index}>
                                      💊 {med.name} –{" "}
                                      {matchedPharmacy?.price
                                        ? `${matchedPharmacy?.price} Birr`
                                        : "Price not available"}{" "}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          )}
                      </div>
                    </button>
                  ))}
              </div>
              {searchResults.type === "medication" && (
                <div className="space-y-6">
                  {sortedResults?.map((pharmacy, index) => (
                    <button
                      key={index}
                      className="block w-full text-left"
                      onClick={() => handleClick({ pharmacy })}
                    >
                      <div
                        key={pharmacy.id}
                        className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border dark:border-gray-700"
                      >
                        <h3 className="text-xl font-semibold mb-2">
                          {pharmacy.name}
                        </h3>
                        <p>{pharmacy.address}</p>
                        <p>
                          Distance of:&nbsp;
                          <strong>
                            {calculateDistance(
                              pharmacy.latitude,
                              pharmacy.longitude,
                              userCoordinates[0],
                              userCoordinates[1]
                            ).toFixed(2)}{" "}
                            Km
                          </strong>
                        </p>
                        <ul className="list-disc list-inside ml-4">
                          {pharmacy.medications.map(
                            (med: any, index: number) => {
                              const matchedPharmacy = med.pharmacies.find(
                                (p: any) => p.id === pharmacy.id
                              );
                              return (
                                <li key={index}>
                                  💊 {med.name} –{" "}
                                  {matchedPharmacy?.price
                                    ? `${matchedPharmacy?.price} Birr`
                                    : "Price not available"}{" "}
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-red-300 dark:border-red-600 bg-gray-50 dark:bg-gray-800 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-400 dark:text-red-500 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-400 text-lg font-medium">
                No results found.
              </p>
              <p className="text-red-400 text mt-1">
                Sorry, We couldn't find any medication right now.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Google Map Section */}
      <h2 className="text-xl font-semibold">Find Pharmacies on Google Map</h2>
      {userLocation.latitude && userLocation.longitude ? (
        <PharmacyMap
          userCoordinates={userCoordinates}
          pharmacies={
            searchResults.type === "pharmacy"
              ? searchResults.data
              : // extract pharmacies from medication-based results
                searchResults.data.map((entry) => ({
                  id: entry.id,
                  name: entry.name,
                  latitude: entry.latitude,
                  longitude: entry.longitude,
                  ...entry,
                }))
          }
          userLocationError={userLocation.error}
        />
      ) : (
        <p className="text-sm text-center text-red-600 dark:text-red-300 bg-red-50 dark:bg-transparent border border-red-300 dark:border-red-700 px-4 py-3 rounded-md shadow-sm">
          Please enable location services to view nearby pharmacies on map.
        </p>
      )}
    </div>
  );
};

export default SearchResults;
