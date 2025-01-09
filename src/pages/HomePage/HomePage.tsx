import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { pharmacies } from "../../data/pharmacies";
import "./HomePage.scss";
import WhyUseMedLocator from "../../components/common/WhyUseMedLocator";
import HeroSection from "../../components/HeroSection/HeroSection";
import PharmacyList from "../../components/PharmacyList/PharmacyList";
import { calculateDistance } from "../../utils/calculations";

const HomePage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Get user geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting user location", error);
        setUserLocation([0, 0]); // Default location if geolocation fails
      }
    );
  }, []);

  const categories = Array.from(
    new Set(
      pharmacies.flatMap((pharmacy) =>
        pharmacy.available_drugs.map((drug) => drug.category)
      )
    )
  );

  const filteredPharmacies = selectedCategory
    ? pharmacies.filter((pharmacy) =>
        pharmacy.available_drugs.some(
          (drug) => drug.category === selectedCategory
        )
      )
    : pharmacies;

  const visiblePharmacies = filteredPharmacies.slice(0, visibleCount);

  const handleShowAll = () => {
    setVisibleCount(filteredPharmacies.length);
  };

  return (
    <div className="home-page">
      <HeroSection />

      <div className="browse-categories-wrapper">
        <h2 className="section-title">Browse by Medication Category</h2>
        <ul className="categories-list">
          {categories.map((category) => (
            <li
              key={category}
              className={`category-item ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
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
      <h2 className="section-title">Featured Pharmacies</h2>
      <PharmacyList
        pharmacies={visiblePharmacies}
        calculateDistance={(lat, lon) =>
          userLocation
            ? calculateDistance(lat, lon, userLocation[0], userLocation[1])
            : "Unknown"
        }
        onShowAll={handleShowAll}
        showAllButton={visibleCount < filteredPharmacies.length}
      />

      {/* Map Section */}
      {userLocation && (
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>
          {filteredPharmacies.map((pharmacy) => (
            <Marker
              key={pharmacy.pharmacy_id}
              position={[pharmacy.latitude, pharmacy.longitude]}
            >
              <Popup>
                {pharmacy.pharmacy_name}
                <br />
                Distance:{" "}
                {calculateDistance(
                  pharmacy.latitude,
                  pharmacy.longitude,
                  userLocation[0],
                  userLocation[1]
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default HomePage;
