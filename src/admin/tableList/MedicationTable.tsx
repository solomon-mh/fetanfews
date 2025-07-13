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
  const [, setMedications] = useState<medicationType[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const { pharmacyMed } = usePharmacyStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [medicationsPerPage, setMedicationsPerPage] = useState(5);
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
            className="w-full  px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-300 transition"
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
            <div className="overflow-x-auto rounded-xl shadow-md dark:bg-gray-900 bg-white">
              <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-100">
                <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Dosage Form</th>
                    <th className="px-4 py-3">Strength</th>
                    <th className="px-4 py-3">Manufacturer</th>
                    <th className="px-4 py-3">Expiry</th>
                    <th className="px-4 py-3">Rx</th>
                    <th className="px-4 py-3">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentMedications.map((medication) => (
                    <tr
                      key={medication.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="px-4 py-2">
                        <img
                          src={medication.image}
                          alt="No Image"
                          className="w-10 h-10 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.src = defaultImage;
                          }}
                        />
                      </td>
                      <td className="px-4 py-2">{medication.name}</td>
                      <td className="px-4 py-2">
                        {medication.pivot?.price} Birr
                      </td>
                      <td
                        className={`px-4 py-2 font-medium ${
                          medication.pivot?.stock_status
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {medication.pivot?.stock_status
                          ? "In Stock"
                          : "Out of Stock"}
                      </td>
                      <td className="px-4 py-2">
                        {medication?.category?.name}
                      </td>
                      <td className="px-4 py-2">{medication.dosage_form}</td>
                      <td className="px-4 py-2">
                        {medication.dosage_strength}
                      </td>
                      <td className="px-4 py-2">
                        {medication.pivot?.manufacturer}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(medication.expiry_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {medication.prescription_required ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-2">
                        {medication.pivot?.quantity_available}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2 text-xs justify-end-safe mt-4">
              <div className="mx-2">
                <label htmlFor="rows" className="mx-2">
                  Rows per Page
                </label>
                <select
                  name="rows"
                  id="rows"
                  value={medicationsPerPage}
                  onChange={(e) =>
                    setMedicationsPerPage(Number(e.target.value))
                  }
                  className="px-2 py-1 border border-gray-300 dark:border-gray-800 rounded dark:bg-gray-800 dark:text-white"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                </select>
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-base px-2 py-2 bg-gry-200  text-gray-800 dark:text-gray-200 rounded cursor-pointer disabled:opacity-50"
              >
                &lt;
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-base py-2 bg-gay-200  text-gray-800 dark:text-gray-200 rounded cursor-pointer disabled:opacity-50"
              >
                &gt;
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
