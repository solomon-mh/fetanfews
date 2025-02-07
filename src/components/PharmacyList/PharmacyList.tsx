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

  // Sort pharmacies by distance
  const sortedPharmacies = [...pharmacies].sort((a, b) => {
    const distanceA = calculateDistance(
      a.latitude,
      a.longitude,
      userCoordinates[0],
      userCoordinates[1]
    );
    const distanceB = calculateDistance(
      b.latitude,
      b.longitude,
      userCoordinates[0],
      userCoordinates[1]
    );
    if (isNaN(distanceA) || isNaN(distanceB)) {
      return 0; // If any distance is invalid, keep the current order
    }
    return distanceA - distanceB; // Sort in ascending order of distance
  });
  console.log("User Coordinates:", userCoordinates);
  console.log("Sorted Pharmacies:", sortedPharmacies);

  return (
    <div className="pharmacies-list-wrapper">
      <ul className="pharmacies-list">
        {sortedPharmacies.map((pharmacy) => {
          return (
            <motion.li
              key={pharmacy.id}
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
                <Link
                  to={`/pharmacy/${encodeURIComponent(pharmacy.name)}?id=${
                    pharmacy.id
                  }`}
                >
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
                ).toFixed(2)}{" "}
                Km
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
