/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// import { calculateDistance } from "../../utils/calculations";
import { Search } from "../../utils/handleSearch";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import PharmacyMap from "../../components/MapView/MapView";
import { Link, useSearchParams } from "react-router-dom";
import { calculateDistance } from "../../utils/calculations";

const SearchResults: React.FC = () => {
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

  console.log("searchResults");
  console.log(searchResults);

  // const handleShowAll = () => {
  //   setVisibleCount(searchResults.data.length);
  // };

  return (
    <div className="search-results-page px-4 md:px-10 py-6 space-y-6 text-gray-800 dark:text-gray-100">
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
                  searchResults?.data?.map((pharmacy: any) => (
                    <Link
                      to={`/pharmacy/${encodeURIComponent(pharmacy.name)}?id=${
                        pharmacy.id
                      }`}
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
                        {searchParams.get("medication") &&
                          pharmacy?.medications?.length > 0 && (
                            <ul className="list-disc list-inside ml-4">
                              {pharmacy?.medications?.map((med: any) => {
                                const matchedPharmacy = med?.pharmacies?.find(
                                  (p: any) => p.id === pharmacy.id
                                );
                                return (
                                  <li key={med.id}>
                                    💊 {med.name} –{" "}
                                    {matchedPharmacy?.pivot?.price ??
                                      "Price not available"}{" "}
                                    Birr
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                      </div>
                    </Link>
                  ))}
              </div>
              {searchResults.type === "medication" && (
                <div className="space-y-6">
                  {searchResults.data.map((pharmacy) => (
                    <Link
                      to={`/pharmacy/${encodeURIComponent(pharmacy.name)}?id=${
                        pharmacy.id
                      }`}
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
                          {pharmacy.medications.map((med: any) => {
                            const matchedPharmacy = med.pharmacies.find(
                              (p: any) => p.id === pharmacy.id
                            );
                            return (
                              <li key={med.id}>
                                💊 {med.name} –{" "}
                                {matchedPharmacy?.pivot?.price ??
                                  "Price not available"}{" "}
                                Birr{" "}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-center my-6 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 px-4 py-3 rounded-md shadow-sm">
              No results found. Please refine your search.
            </p>
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
        <p className="text-sm text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 px-4 py-3 rounded-md shadow-sm">
          Please enable location services to view nearby pharmacies on map.
        </p>
      )}
    </div>
  );
};

export default SearchResults;
