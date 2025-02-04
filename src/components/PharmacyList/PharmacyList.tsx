import React from "react";
import "./PharmacyList.scss";
import { Link } from "react-router-dom";
import { PharmacyListProps } from "../../utils/interfaces";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { motion } from "framer-motion";
import { cardVariants } from "../../utils/animateVariant";

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

  console.log("from pharmacy list", pharmacies);
  

  return (
    <div className="pharmacies-list-wrapper">
      <ul className="pharmacies-list">
        {pharmacies.map((pharmacy) => {
          

          return (
            <motion.li
              key={pharmacy.id} // Always add a unique key
              className="pharmacy-item"
              variants={cardVariants}
              initial="hidden"
              animate={"visible"}
              whileHover="hover"
              transition={{ duration: 0.5 }}
            >
              <img
              src={`http://127.0.0.1:8000${pharmacy.image}`} 
              alt={pharmacy.name}
                className="pharmacy-image"
              />

              <h3>
                <Link to={`/pharmacy/${pharmacy.id}`}>
                  {pharmacy.name}
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
            </motion.li>
          );
        })}
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
