import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import pharmacistImage from "../../assets/images/pharmacist1.svg"; // Update the path as needed
import "./HeroSection.scss";
import { useNavigate, Link } from "react-router-dom";
import { fetchMostSearchedMedications } from "../../api/medicationService";
import { medicationType } from "../../utils/interfaces";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams();
  // const frequentlySearchedDrugs = [
  //   "Paracetamol",
  //   "Ibuprofen",
  //   "Amoxicillin",
  //   "Metformin",
  //   "Aspirin",
  // ];
  const [frequentlySearchedDrugs, setFrequentlySearchedDrugs] = useState<
    medicationType[]
    >([]);

  const handleDrugSearch = (drug: string) => {
    if (drug) queryParams.append("medication", drug);
    navigate(`/search-results/?${queryParams.toString()}`);
  };
  useEffect(() => {
    const getMedications = async () => {
      const data = await fetchMostSearchedMedications();
      setFrequentlySearchedDrugs(data);
    };

    getMedications();
  }, []);
  return (
    <div className="hero-wrapper">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Drugs & Pharmacies <br /> Near You, in Bahir Dar
          </h1>
          <p className="hero-subtitle">
            We have all the drugs your doctor prescribed for your health and
            what’s more, we can get it to you.
          </p>
          <SearchBar />

          {frequentlySearchedDrugs.length > 0 && (
            <div className="frequently-searched">
              <h2 className="frequently-searched-title">
                Frequently Searched Drugs
              </h2>
              <ul className="frequently-searched-list">
                {frequentlySearchedDrugs.map((drug) => (
                  <li
                    key={drug.id}
                    className="drug-item"
                    onClick={() => handleDrugSearch(drug.name)}
                  >
                    {drug.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div>
        <Link to="/nearby-pharmacies/" className="find-nearby">
          Find Nearby Pharmacies
        </Link>
      </div>
      <div className="hero-image-container">
        <img src={pharmacistImage} alt="Hero" className="hero-image" />
      </div>
    </div>
  );
};

export default HeroSection;
