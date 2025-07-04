import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { useNavigate, Link } from "react-router-dom";
import { fetchMostSearchedMedications } from "../../api/medicationService";
import { medicationType } from "../../utils/interfaces";
import SearchResults from "../SearchResults/SearchResults";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const [frequentlySearchedDrugs, setFrequentlySearchedDrugs] = useState<
    medicationType[]
  >([]);

  const handleDrugSearch = (drug: string) => {
    if (drug) queryParams.set("medication", drug);
    navigate(`?${queryParams.toString()}`);
  };

  useEffect(() => {
    const getMedications = async () => {
      const data = await fetchMostSearchedMedications();
      setFrequentlySearchedDrugs(data);
    };

    getMedications();
  }, []);

  return (
    <div className="hero-wrapper px-12 py-40 dark:bg-gray-800 dark:text-white">
      {/* Left Content */}
      <div className="flex-1 space-y-6 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-green-700 dark:text-lime-300 leading-tight">
          Find Drugs & Pharmacies <br className="hidden md:block" /> Nearby
        </h1>
        <p className="text-lg text-gray-700 dark:text-white max-w-xl">
          We have all the drugs your doctor prescribed for your health and
          what&apos;s more, we can get it to you.
        </p>

        <div className="max-w-xl mx-auto md:mx-0">
          <SearchBar />
        </div>
        <SearchResults />

        {frequentlySearchedDrugs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 mt-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-3">
              Frequently Searched Drugs
            </h2>
            <ul className="flex flex-wrap gap-3">
              {frequentlySearchedDrugs.map((drug) => (
                <li
                  key={drug.id}
                  onClick={() => handleDrugSearch(drug.name)}
                  className="cursor-pointer bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm hover:bg-indigo-200 transition"
                >
                  {drug.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <Link
            to="/nearby-pharmacies/"
            className="inline-block bg-lime-600 text-white px-6 py-3 rounded-lg shadow hover:bg-lime-700 transition"
          >
            Find Nearby Pharmacies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
