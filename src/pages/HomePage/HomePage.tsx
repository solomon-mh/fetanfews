/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { pharmacies } from "../../data/pharmacies";
import "./HomePage.scss";
import WhyUseMedLocator from "../../components/common/WhyUseMedLocator";
import HeroSection from "../../components/HeroSection/HeroSection";
import PharmacyList from "../../components/PharmacyList/PharmacyList";
import { calculateDistance } from "../../utils/calculations";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { fetchCategoriesData } from "../../api/pharmacyService";
import { CategoryType } from "../../utils/interfaces";
import { fetchPharmacyData } from "../../api/pharmacyService";
import { PharmacyDataType } from "../../utils/interfaces";
const HomePage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [pharmacies, setPharmacies] = useState<PharmacyDataType[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userLocation = useGeoLocation();


  
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategoriesData();
        setCategories(data); 
      } catch (err) {
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    getCategories(); // Call the function on component mount
  }, []);
  useEffect(() => {
    const getPharmacies= async () => {
      try {
        const data = await fetchPharmacyData();
        setPharmacies(data); 
        console.log("pharmacy data", data);
      } catch (err) {
        setError("Failed to fetch pharmacies.");
      } finally {
        setLoading(false);
      }
    };

    getPharmacies(); 
  }, []);

  // const filteredPharmacies = selectedCategory
  //   ? pharmacies.filter((pharmacy) =>
  //       pharmacy.available_drugs.some(
  //         (drug) => drug.category === selectedCategory
  //       )
  //     )
  //   : pharmacies;

  const visiblePharmacies = pharmacies.slice(0, visibleCount);

  const handleShowAll = () => {
    setVisibleCount(pharmacies.length);
  };

  // Default coordinates for the map if geolocation fails
  const userCoordinates: [number, number] =
    userLocation.latitude && userLocation.longitude
      ? [userLocation.latitude, userLocation.longitude]
      : defaultCoordinates;
  
      if (loading) return <p>Loading ...</p>;
      if (error) return <p>{error}</p>;

  return (
    <div className="home-page">
      <HeroSection />

      <div className="browse-categories-wrapper">
        <h2 className="section-title">Browse by Medication Category</h2>
        <ul className="categories-list">
          {categories.map((category) => (
            <li
              key={category.id}
              className={`category-item ${
                selectedCategory === category.name ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </li>
          ))}
          <li
            className={`category-item ${!selectedCategory ? "active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </li>
        </ul>
      </div>
      {!selectedCategory && <WhyUseMedLocator />}

      {userLocation.error && (
        <p className="error-message">{userLocation.error}</p>
      )}

      <h2 className="section-title">Featured Pharmacies</h2>
      <PharmacyList
        pharmacies={visiblePharmacies}
        calculateDistance={(lat, lon) =>
        calculateDistance(lat, lon, userCoordinates[0], userCoordinates[1])
        }
        onShowAll={handleShowAll}
        showAllButton={visibleCount < pharmacies.length}
      />

      {/* Map Section */}
      <h2 className="section-title">Find Pharmacies on Google Map</h2>
      {userLocation.latitude && userLocation.longitude ? (
        <MapContainer
          center={userCoordinates}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
          scrollWheelZoom={false} 
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={userCoordinates}>
            <Popup>Your Location</Popup>
          </Marker>
          {pharmacies.map((pharmacy) => (
            <Marker
              key={pharmacy.id}
              position={[pharmacy.latitude, pharmacy.longitude]}
            >
              <Popup>
                {pharmacy.name}
                <br />
                Distance:{" "}
                {userLocation.latitude && userLocation.longitude
                  ? calculateDistance(
                      pharmacy.latitude,
                      pharmacy.longitude,
                      userLocation.latitude,
                      userLocation.longitude
                    )
                  : "Unknown"}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>Please enable location services to view nearby pharmacies.</p>
      )}
    </div>
  );
};

export default HomePage;
