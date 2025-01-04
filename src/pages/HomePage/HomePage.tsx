import React, { useState, useEffect } from "react";
import "./HomePage.scss"; 
interface Pharmacy {
  name: string;
  distance: string;
}

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const [location, setLocation] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]); // Adjust based on your search results data structure
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [medications, setMedications] = useState<string[]>([]);

  // Handle search functionality
  const handleSearch = (query: string) => {
    console.log("Searching for:", query, "in location:", location);
    // Example: Fetch search results from an API
    // fetchDrugs(query, location).then((results) => setSearchResults(results));
  };

  // Handle location change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  // Handle medication browsing
  const handleBrowseMedication = (category: string) => {
    console.log("Browsing medications in category:", category);
    // Example: Fetch medications based on the selected category
    // fetchMedications(category).then((results) => setMedications(results));
  };

  // Example: Fetch nearby pharmacies
  const fetchNearbyPharmacies = () => {
    const mockPharmacies = [
      { name: "Pharmacy A", distance: "1.2 km" },
      { name: "Pharmacy B", distance: "3.4 km" },
      { name: "Pharmacy C", distance: "2.1 km" },
    ];
    setPharmacies(mockPharmacies);
  };

  // Example: Fetch medication categories
  const fetchMedicationCategories = () => {
    const mockCategories = [
      "Painkillers",
      "Antibiotics",
      "Vitamins",
      "Allergy Medications",
      "Skin Care",
    ];
    setMedications(mockCategories);
  };

  // Load pharmacies and categories on component mount
  useEffect(() => {
    fetchNearbyPharmacies();
    fetchMedicationCategories();
  }, []);

  return (
    <div className="home-page">
            <div className="browse-medication">
        <h2 className="section-title">Browse by Medication</h2>
        <div className="medication-categories">
          {medications.map((category) => (
            <button
              key={category}
              className="medication-category-button"
              onClick={() => handleBrowseMedication(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      {/* Pharmacies List */}
      <div className="pharmacies-list">
        <h2 className="section-title">Nearby Pharmacies</h2>
        <ul>
          {pharmacies.length > 0 ? (
            pharmacies.map((pharmacy, index) => (
              <li key={index} className="pharmacy-item">
                <h3>{pharmacy.name}</h3>
                <p>{pharmacy.distance} away</p>
              </li>
            ))
          ) : (
            <p>No pharmacies found in your location.</p>
          )}
        </ul>
      </div>

      {/* Browse by Medication Categories */}


   
    </div>
  );
};

export default HomePage;
