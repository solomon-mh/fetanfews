/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import SnackbarComponent from "../modals/SnackbarComponent";
import "./tables.scss";
import { medicationType } from "../../utils/interfaces";
import { fetchMedicationsData } from "../../api/pharmacyService";

interface MedicationTableProps {
  filter: string;
}

const MedicationTable: React.FC<MedicationTableProps> = ({
  filter = "all",
}) => {
  const [medications, setMedications] = useState<medicationType[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

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
    setSearchQuery(""); // Reset search query when the filter changes
    setCurrentPage(1);   // Reset to the first page whenever the filter changes
  }, [filter]);

  // Apply filtering based on stock status, expiry date, and search query
  const filteredMedications = medications.filter((medication) => {
    if (filter === "inStock" && medication.stock_status !== true) return false;
    if (filter === "outOfStock" && medication.stock_status !== false) return false;
    if (filter === "expired" && new Date(medication.expiry_date) >= new Date())
      return false;
    if (
      searchQuery &&
      !medication.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
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
      <div className="medication-table">
        <h2>
          {filter === "all"
            ? "All Medications"
            : filter === "inStock"
            ? "In-Stock Medications"
            : filter === "outOfStock"
            ? "Out-of-Stock Medications"
            : "Expired Medications"}
        </h2>

        {currentMedications.length === 0 ? (
          <p className="no-data">No {filter} medications found.</p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Search Medications..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />

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
                        src={`http://127.0.0.1:8000${medication.image}`}
                        alt="No Image"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{medication.name}</td>
                    <td>{medication.price} Birr</td>
                    <td
                      className={
                        medication.stock_status ? "in-stock" : "out-of-stock"
                      }
                    >
                      {medication.stock_status ? "In Stock" : "Out of Stock"}
                    </td>
                    <td>{medication.category_name}</td>
                    <td>{medication.dosage_form}</td>
                    <td>{medication.dosage_strength}</td>
                    <td>{medication.manufacturer}</td>
                    <td>
                      {new Date(medication.expiry_date).toLocaleDateString()}
                    </td>
                    <td>{medication.prescription_required ? "Yes" : "No"}</td>
                    <td>{medication.quantity_available}</td>
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
