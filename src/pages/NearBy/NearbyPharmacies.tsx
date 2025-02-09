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
import "./nearbyPharmcy.scss";

const NearbyPharmacies: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedRange, setSelectedRange] = useState<{
    lower: number;
    upper: number;
  }>({ lower: 0, upper: 5 });
  const [visibleCount, setVisibleCount] = useState(5);
  const [error, setError] = useState<string | null>(null);

  const userLocation = useGeoLocation();
  const userCoordinates: [number, number] =
    userLocation.latitude && userLocation.longitude
      ? [userLocation.latitude, userLocation.longitude]
      : defaultCoordinates;

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

  useEffect(() => {
    fetchNearbyPharmacies(selectedRange.lower, selectedRange.upper);
  }, [selectedRange]);

  const handleShowAll = () => {
    setVisibleCount(searchResults.length);
  };
  if (error) {
    return (
      <div className="error-message">
        <h3>Error:</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="nearby-pharmacies">
      {/* Distance Filter */}
      <div className="filter-section">
        <h3 className="filter-title">Filter by Distance</h3>
        <div className="distance-filters">
          {distanceOptions.map((option) => (
            <label
              key={`${option.lower}-${option.upper}`}
              className="radio-label"
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
                  setSelectedRange({ lower: option.lower, upper: option.upper })
                }
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
        <button
          onClick={() => setSelectedRange({ lower: 0, upper: 5 })}
          className="reset-btn"
        >
          Reset Distance
        </button>
      </div>

      <div className="filter-results">
        {isLoading ? (
          <p>Loading...</p>
        ) : searchResults.length > 0 ? (
          <>
            <h2 className="section-title">
              {searchResults.length} pharmacies found
            </h2>
            <PharmacyList
              pharmacies={searchResults}
              calculateDistance={calculateDistance}
              showAllButton={true}
            />
          </>
        ) : (
          <p className="no-results">
            No results found. Please refine your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default NearbyPharmacies;
