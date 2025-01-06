import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PharmacyDetails.scss";
import { PharmacyDetailProps } from "../../utils/interfaces";

// You could use a package like 'react-router-breadcrumbs' or create your own breadcrumbs component
const Breadcrumbs: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="breadcrumbs">
      <span onClick={() => navigate("/")}>Home</span> &gt;{" "}
      <span onClick={() => navigate("/pharmacies")}>Pharmacies</span> &gt;{" "}
      <span>Pharmacy Details</span>
    </nav>
  );
};

const PharmacyDetailPage: React.FC<PharmacyDetailProps> = ({
  pharmacies,
  calculateDistance,
}) => {
  const { pharmacyId } = useParams<{ pharmacyId: string }>();
  const navigate = useNavigate();

  // Find the pharmacy by ID
  const pharmacy = pharmacies.find(
    (p) => p.pharmacy_id === parseInt(pharmacyId || "")
  );

  if (!pharmacy) {
    return <p>Pharmacy not found.</p>;
  }

  const handleDrugClick = (drugName: string) => {
    alert(`You clicked on ${drugName}`);
  };

  return (
    <div className="pharmacy-detail">
      <Breadcrumbs />

      <div className="pharmacy-info">
        <img
          src={pharmacy.image}
          alt={pharmacy.pharmacy_name}
          className="pharmacy-image"
        />
        <h1 className="pharmacy-name">{pharmacy.pharmacy_name}</h1>
        <p className="pharmacy-address">{pharmacy.address}</p>
        <p className="pharmacy-distance">
          Distance: {calculateDistance(pharmacy.latitude, pharmacy.longitude)}
        </p>
        <button
          className="call-button"
          onClick={() => alert(`Calling ${pharmacy.pharmacy_name}`)}
        >
          Call Pharmacy
        </button>
      </div>

      <div className="drug-list">
        <h2>Available Drugs</h2>
        <ul>
          {pharmacy.available_drugs.map((drug) => (
            <li key={drug.drug_id}>
              <p>
                <strong>{drug.name}</strong> - {drug.category}
              </p>
              <button
                className="drug-details-button"
                onClick={() => handleDrugClick(drug.name)}
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PharmacyDetailPage;
