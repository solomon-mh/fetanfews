import React, { useRef } from "react";
import "./PharmacyList.scss";
import { Link } from "react-router-dom";
import { PharmacyListProps } from "../../utils/interfaces";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { motion, useInView } from "framer-motion";
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
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true, // Trigger only once
  });

  return (
    <div className="pharmacies-list-wrapper">
      {/* <h2 className="section-title">Featured Pharmacies</h2> */}
      <ul className="pharmacies-list">
        {pharmacies.map((pharmacy) => (
          <motion.li
            key={pharmacy.pharmacy_id}
            ref={ref}
            className="pharmacy-item"
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover="hover"
            transition={{ duration: 0.5 }}
          >
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
          </motion.li>
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
