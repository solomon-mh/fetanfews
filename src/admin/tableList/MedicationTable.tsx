/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import SnackbarComponent from "../modals/SnackbarComponent";
import { medicationType } from "../../utils/interfaces";
import { fetchMedicationsData } from "../../api/pharmacyService";
import defaultImage from "../../assets/default-pill-image.png";
import { usePharmacyStore } from "../../store/usePharmacyStore";

interface MedicationTableProps {
  filter: string;
}

const MedicationTable: React.FC<MedicationTableProps> = ({
  filter = "all",
}) => {
  const [_medications, setMedications] = useState<medicationType[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const { pharmacyMed } = usePharmacyStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [medicationsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ open: true, message, type });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMedicationsData();
        setMedications(data);
      } catch (error: any) {
        showSnackbar(error.message, "error");
      }
    };
    fetchData();
  }, []);

  // Reset search query when filter changes
  useEffect(() => {
    setSearchQuery("");
    setCurrentPage(1);
  }, [filter]);
  // Apply filtering based on stock status, expiry date, and search query
  const filteredMedications = pharmacyMed.filter((medication) => {
    const inStock = medication.pivot?.stock_status === true;
    const isExpired = new Date(medication.expiry_date) < new Date();
    const matchesSearch =
      !searchQuery ||
      medication.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === "inStock" && inStock) return false;
    if (filter === "outOfStock" && !inStock) return false;
    if (filter === "expired" && !isExpired) return false;
    if (!matchesSearch) return false;

    return true;
  });

  // Pagination logic
  const indexOfLastMedication = currentPage * medicationsPerPage;
  const indexOfFirstMedication = indexOfLastMedication - medicationsPerPage;
  const currentMedications = filteredMedications.slice(
    indexOfFirstMedication,
    indexOfLastMedication
  );
  const totalPages = Math.ceil(filteredMedications.length / medicationsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="medication-table dark:text-zinc-50">
        <h2>
          {filter === "all"
            ? "All Medications"
            : filter === "inStock"
            ? "In-Stock Medications"
            : filter === "outOfStock"
            ? "Out-of-Stock Medications"
            : "Expired Medications"}
        </h2>
        <div className="my-6">
          <input
            type="text"
            placeholder="Search Medications..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        {currentMedications.length === 0 ? (
          <>
            <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-center shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                No {filter} medications found.
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                We couldn't find any information to display right now.
              </p>
            </div>
          </>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Category</th>
                  <th>Dosage Form</th>
                  <th>Dosage Strength</th>
                  <th>Manufacturer</th>
                  <th>Expiry Date</th>
                  <th>Prescription Required</th>
                  <th>Quantity Available</th>
                </tr>
              </thead>
              <tbody>
                {currentMedications.map((medication) => (
                  <tr key={medication.id}>
                    <td>
                      <img
                        src={medication.image}
                        alt="No Image"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.currentTarget.src = defaultImage;
                        }}
                      />
                    </td>
                    <td>{medication.name}</td>
                    <td>{medication.pivot?.price} Birr</td>
                    <td
                      className={
                        medication.pivot?.stock_status
                          ? "in-stock"
                          : "out-of-stock"
                      }
                    >
                      {medication.pivot?.stock_status
                        ? "In Stock"
                        : "Out of Stock"}
                    </td>
                    <td>{medication?.category?.name}</td>
                    <td>{medication.dosage_form}</td>
                    <td>{medication.dosage_strength}</td>
                    <td>{medication.pivot?.manufacturer}</td>
                    <td>
                      {new Date(medication.expiry_date).toLocaleDateString()}
                    </td>
                    <td>{medication.prescription_required ? "Yes" : "No"}</td>
                    <td>{medication.pivot?.quantity_available}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </>
  );
};

export default MedicationTable;
