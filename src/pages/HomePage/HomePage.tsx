/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import WhyUseFetanfews from "../../components/common/WhyUseFetanFews";
import HeroSection from "../../components/HeroSection/HeroSection";
import PharmacyList from "../../components/PharmacyList/PharmacyList";
import { calculateDistance } from "../../utils/calculations";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { CategoryType } from "../../utils/interfaces";
// import { browse_by_categories } from "../../api/pharmacyService";
import { fetchPharmacyData } from "../../api/pharmacyService";
import { PharmacyDataType } from "../../utils/interfaces";
import { useError } from "../../contexts/ErrorContext";
import PharmacyMap from "../../components/MapView/MapView";
import PharmacySkeleton from "../../components/common/PharmacySkeleton";
const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  // const [categories, setCategories] = useState<CategoryType[]>([]);
  const [_pharmacies, setPharmacies] = useState<PharmacyDataType[]>([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const userLocation = useGeoLocation();
  const { setError } = useError();

  useEffect(() => {
    setLoading(true);
    const getCategories = async () => {
      try {
        // const data: CategoryType[] = await browse_by_categories();
        // setCategories(data);
      } catch (err) {
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    getCategories(); // Call the function on component mount
  }, [setError]);
  useEffect(() => {
    const getPharmacies = async () => {
      try {
        const data = await fetchPharmacyData();
        setPharmacies(data);
        setFilteredPharmacies(data);
        setSelectedCategory(null);
      } catch (err) {
        setError("Failed to fetch pharmacies.");
      } finally {
        setLoading(false);
      }
    };

    getPharmacies();
  }, [setError]);

  // Default coordinates for the map if geolocation fails
  const userCoordinates: [number, number] =
    userLocation.latitude && userLocation.longitude
      ? [userLocation.latitude, userLocation.longitude]
      : defaultCoordinates;

  if (loading) {
    return <PharmacySkeleton />;
  }

  return (
    <div className="home-page dark:bg-gray-900 dark:text-white">
      <HeroSection />
      <div className="browse-categories-wrapper dark:bg-gray-800 px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Browse by Medication Category
        </h2>
        {/* <ul className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <li
              key={category.id}
              className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition 
        ${
          selectedCategory?.name === category.name
            ? "bg-lime-600 text-white dark:bg-lime-500"
            : "bg-gray-100 text-gray-700 hover:bg-blue-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-900"
        }`}
              // onClick={() => handleSearchByCategory(category)}
            >
              {category.name}
            </li>
          ))}
          <li
            className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition 
      ${
        !selectedCategory?.name
          ? "bg-lime-600 text-white dark:bg-lime-500"
          : "bg-gray-100 text-gray-700 hover:bg-blue-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-900"
      }`}
            onClick={() => handleSearchByCategory(null)}
          >
            All Categories
          </li>
        </ul> */}
      </div>
      {userLocation.error && (
        <p className="text-center my-6 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 px-4 py-3 rounded-md shadow-sm max-w-md mx-auto">
          {userLocation.error}
        </p>
      )}

      <h2 className="section-title px-12 dark:text-white dark:bg-gray-800">
        {selectedCategory
          ? `Pharmacies Found for "${selectedCategory?.name}"`
          : "Featured Pharmacies"}
      </h2>
      {filteredPharmacies.length === 0 ? (
        <p className="text-center my-6 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 px-4 py-3 rounded-md shadow-sm max-w-md mx-auto">
          No pharmacy found for this category.
        </p>
      ) : (
        <PharmacyList
          pharmacies={filteredPharmacies}
          calculateDistance={(lat: number, lon: number) =>
            calculateDistance(lat, lon, userCoordinates[0], userCoordinates[1])
          }
        />
      )}
      {/* Map Section */}
      <h2 className="section-title px-12">Find Pharmacies on Google Map</h2>
      {userLocation.latitude && userLocation.longitude ? (
        <PharmacyMap
          userCoordinates={userCoordinates}
          pharmacies={filteredPharmacies}
          userLocationError={userLocation.error}
        />
      ) : (
        <p className="text-center my-6 text-red-600 dark:text-red-300 bg-red-50 dark:bg-transparent border border-red-300 dark:border-red-700 px-4 py-3 rounded-md shadow-sm max-w-md mx-auto">
          Please enable location services to view nearby pharmacies.
        </p>
      )}
      {!selectedCategory && <WhyUseFetanfews />}
    </div>
  );
};

export default HomePage;
