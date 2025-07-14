/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";

import { TablePagination } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Edit } from "@mui/icons-material";
import AddMedicationModal from "../modals/AddMedicationModal";
import DeleteModal from "../modals/DeleteModal";
import SearchIcon from "@mui/icons-material/Search";
import { medicationType, UserRole } from "../../utils/interfaces";
import {
  addMedicationData,
  fetchMedicationsData,
  editMedication,
  deleteMedication,
} from "../../api/pharmacyService";
import SnackbarComponent from "../modals/SnackbarComponent";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import defaultMedicationImage from "../../assets/default-pill-image.png";

const ManageMedications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [medications, setMedications] = useState<medicationType[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [medicationName, setMedicationName] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedMedication, setSelectedMedication] =
    useState<medicationType | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const { user } = useAuth();
  const showSnackbar = useCallback(
    (message: string, type: "success" | "error") => {
      setSnackbar({ open: true, message, type });
    },
    []
  );
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenForm = (medication: medicationType | null = null) => {
    if (medication) {
      setIsEdit(true);
      setSelectedMedication(medication);
    } else {
      setIsEdit(false);
      setSelectedMedication(null);
    }
    setOpenForm(true);
  };
  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const fetchMedications = useCallback(async () => {
    try {
      const data = await fetchMedicationsData();
      setMedications(data);
    } catch (error: any) {
      showSnackbar(error.message, "error");
    }
  }, [showSnackbar]);

  // Handle form submission
  const handleSubmit = async (data: any) => {
    try {
      if (isEdit && selectedMedication) {
        await editMedication(selectedMedication.id, data);
        showSnackbar("Medication updated successfully.", "success");
      } else {
        const res = await addMedicationData(data);
        console.log("res");
        console.log(res);

        showSnackbar("Medication added successfully.", "success");
      }
      fetchMedications();
      handleCloseForm();
      setIsEdit(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data.detail ||
            "Failed to submit the medication data.";
          showSnackbar(errorMessage, "error");
        } else if (error.request) {
          showSnackbar(
            "No response from the server. Please try again later.",
            "error"
          );
        } else {
          showSnackbar(
            "An unexpected error occurred. Please try again.",
            "error"
          );
        }
      }
      setIsEdit(false);
      handleCloseForm();
    }
  };

  // Filter medications based on search query
  const filteredMedications = medications.filter((medication) => {
    const currentUserId = user?.id;

    // Check if medication matches search query
    const matchesSearch = medication.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Check if medication belongs to current user's pharmacy
    const belongsToUserPharmacy = medication.pharmacies.some(
      (pharmacy) => pharmacy?.user_id === currentUserId
    );

    // Only include if both conditions are true
    return matchesSearch && belongsToUserPharmacy;
  });

  // Paginate the filtered medications
  const paginatedMedications = filteredMedications.slice(
    page - 1 * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleDeleteClick = (id: number, name: string) => {
    setDeleteId(id);
    setMedicationName(name);
    setIsDelModalOpen(true);
  };

  const handleDelModalClose = () => {
    setIsDelModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteMedication(deleteId);
      showSnackbar("Medication deleted successfully.", "success");
      fetchMedications();
    } catch (error) {
      showSnackbar("Failed to delete the Medication.", "error");
    }
    setIsDelModalOpen(false);
  };
  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  return (
    <>
      <div className="manage-medications">
        <div className="w-full mb-4 flex flex-col md:flex-row items-center gap-4 max-w-d mx-auto md:p-4 rounded-xl bg-white dark:bg-gray-900 shadow-md">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Manage Medications
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-4 ml-auto mr-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                id="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medications..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-200"
              />
            </div>
            {user?.role === UserRole.PHARMACIST && (
              <button
                onClick={() => handleOpenForm()}
                className="bg-gray-600 cursor-pointer hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200"
              >
                Add Medication
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl shadow-md bg-white dark:bg-gray-900">
          <table className="min-w-[1500px] w-full text-sm text-left text-gray-800 dark:text-gray-100">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Medication Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock Status</th>
                <th className="px-4 py-3">Dosage Form</th>
                <th className="px-4 py-3">Dosage Strength</th>
                <th className="px-4 py-3">Manufacturer</th>
                <th className="px-4 py-3">Expiry Date</th>
                <th className="px-4 py-3">Prescription Required</th>
                <th className="px-4 py-3">Side Effects</th>
                <th className="px-4 py-3">Usage Instructions</th>
                <th className="px-4 py-3">Available Quantity</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {paginatedMedications.map((medication, index) => {
                const currentUserId = user?.id;
                const userPharmacy = medication.pharmacies.find(
                  (pharmacy) => pharmacy?.user_id === currentUserId
                );

                if (!userPharmacy) return null;

                return (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-2">
                      <img
                        src={medication.image}
                        alt="No image"
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = defaultMedicationImage;
                        }}
                      />
                    </td>
                    <td className="px-4 py-2">{medication.name}</td>
                    <td className="px-4 py-2">{medication?.category?.name}</td>
                    <td className="px-4 py-2">
                      {userPharmacy.pivot.price} Birr
                    </td>
                    <td className="px-4 py-2">
                      {userPharmacy.pivot.stock_status ? (
                        <span className="text-green-600 font-medium">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">{medication.dosage_form}</td>
                    <td className="px-4 py-2">{medication.dosage_strength}</td>
                    <td className="px-4 py-2">
                      {userPharmacy.pivot.manufacturer}
                    </td>
                    <td className="px-4 py-2">{medication.expiry_date}</td>
                    <td className="px-4 py-2">
                      {medication.prescription_required ? "Yes" : "No"}
                    </td>
                    <td
                      className="px-4 py-2 max-w-[160px] truncate"
                      title={medication.side_effects}
                    >
                      {medication.side_effects}
                    </td>
                    <td
                      className="px-4 py-2 max-w-[160px] truncate"
                      title={medication.usage_instructions}
                    >
                      {medication.usage_instructions}
                    </td>
                    <td className="px-4 py-2">
                      {userPharmacy.pivot.quantity_available}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleOpenForm(medication)}
                        className="p-2 text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        <Edit className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick(medication.id, medication.name)
                        }
                        className="p-2 text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        <DeleteIcon className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {paginatedMedications.length < 0 && (
          <TablePagination
            component="div"
            count={filteredMedications.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            className="dark:bg-gray-800 dark:text-white"
          />
        )}

        {/* Form Modal */}
      </div>
      <AddMedicationModal
        open={openForm}
        handleClose={handleCloseForm}
        handleSubmit={handleSubmit}
        medication={selectedMedication}
        isEdit={isEdit}
        showSnackbar={showSnackbar}
      />
      <DeleteModal
        isOpen={isDelModalOpen}
        onClose={handleDelModalClose}
        handleDelete={handleDelete}
        itemName={medicationName}
      />
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </>
  );
};

export default ManageMedications;
