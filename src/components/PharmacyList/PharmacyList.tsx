import { Link } from "react-router-dom";
import { PharmacyListProps } from "../../utils/interfaces";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { motion } from "framer-motion";
import { cardVariants } from "../../utils/animateVariant";
import { useState } from "react";
import defaultPharmacyImage from "../../assets/default-pharmacy.png";

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
  console.log(userCoordinates[0], userCoordinates[1]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedPharmacies = sortedPharmacies.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(pharmacies.length / itemsPerPage);

  return (
    <div className="pharmacies-list-wrapper dark:bg-gray-800 px-4 sm:px-6 lg:px-8 py-10">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {displayedPharmacies.map((pharmacy) => (
          <motion.li
            key={pharmacy.id}
            className="pharmacy-item bg-white dark:bg-gray-700 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-75"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ duration: 0.5 }}
          >
            <img
              src={`http://127.0.0.1:8000${pharmacy.image}`}
              alt={pharmacy.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.currentTarget.src = defaultPharmacyImage;
              }}
            />
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-1">
              <Link
                to={`/pharmacy/${encodeURIComponent(pharmacy.name)}?id=${
                  pharmacy.id
                }`}
                className="hover:underline"
              >
                {pharmacy.name}
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
              {pharmacy.address}
            </p>
            <p className="text-gray-700 dark:text-gray-400 text-sm">
              Distance:{" "}
              <span className="font-medium">
                {calculateDistance(
                  pharmacy.latitude,
                  pharmacy.longitude,
                  userCoordinates[0],
                  userCoordinates[1]
                ).toFixed(2)}{" "}
                Km
              </span>
            </p>
          </motion.li>
        ))}
      </ul>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls flex justify-center items-center mt-8 gap-4">
          <button
            className="pagination-button px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="pagination-info text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="pagination-button px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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
