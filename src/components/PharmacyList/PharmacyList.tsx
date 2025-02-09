import "./PharmacyList.scss";
import { Link } from "react-router-dom";
import { PharmacyListProps } from "../../utils/interfaces";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { motion } from "framer-motion";
import { cardVariants } from "../../utils/animateVariant";
import { useState } from "react";

const PharmacyList: React.FC<PharmacyListProps> = ({
  pharmacies,
  calculateDistance,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

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
    return distanceA - distanceB;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedPharmacies = sortedPharmacies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pharmacies.length / itemsPerPage);

  return (
    <div className="pharmacies-list-wrapper">
      <ul className="pharmacies-list">
        {displayedPharmacies.map((pharmacy) => (
          <motion.li
            key={pharmacy.id}
            className="pharmacy-item"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
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
                to={`/pharmacy/${encodeURIComponent(pharmacy.name)}?id=${pharmacy.id}`}
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
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="pagination-button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PharmacyList;
