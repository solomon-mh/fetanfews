import React from "react";
import "./PharmacyList.scss";
import { Link } from "react-router-dom";
import { PharmacyListProps } from "../../utils/interfaces";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
const PharmacyList: React.FC<PharmacyListProps> = ({
  pharmacies,
  calculateDistance,
  onShowAll,
  showAllButton = false,
}) => {
  const userLocation = useGeoLocation();

  const userCoordinates: [number, number] =
    userLocation.latitude && userLocation.longitude
      ? [userLocation.latitude, userLocation.longitude]
      : defaultCoordinates;

  return (
    <div className="pharmacies-list-wrapper">
      {/* <h2 className="section-title">Featured Pharmacies</h2> */}
      <ul className="pharmacies-list">
        {pharmacies.map((pharmacy) => (
          <li key={pharmacy.pharmacy_id} className="pharmacy-item">
            <img
              src={pharmacy.image}
              alt={pharmacy.pharmacy_name}
              className="pharmacy-image"
            />

            <h3>
              <Link to={`/pharmacy/${pharmacy.pharmacy_id}`}>
                {pharmacy.pharmacy_name}
              </Link>
            </h3>
            <p>{pharmacy.address}</p>
            <p>
              Distance:{" "}
              {calculateDistance(
                pharmacy.latitude,
                pharmacy.longitude,
                userCoordinates[0],
                userCoordinates[1]
              )}
            </p>
          </li>
        ))}
      </ul>
      {showAllButton && onShowAll && (
        <button className="show-all-button" onClick={onShowAll}>
          Show All
        </button>
      )}
    </div>
  );
};

export default PharmacyList;
