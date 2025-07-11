/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  TextField,
  Box,
  TablePagination,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Edit } from "@mui/icons-material";
import AddMedicationModal from "../modals/AddMedicationModal";
import DeleteModal from "../modals/DeleteModal";
import SearchIcon from "@mui/icons-material/Search";
import { medicationType } from "../../utils/interfaces";
import {
  addMedicationData,
  fetchMedicationsData,
  editMedication,
  deleteMedication,
} from "../../api/pharmacyService";
import SnackbarComponent from "../modals/SnackbarComponent";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
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
        <Box className="top-section">
          <Typography className="title" variant="h4" gutterBottom>
            Manage Medications
          </Typography>

          <TextField
            className="search-bar"
            label="Search Medications"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {user?.role === "pharmacist" && (
            <Button
              className="add-button"
              variant="contained"
              color="primary"
              size="large"
              onClick={() => handleOpenForm()}
            >
              Add Medication
            </Button>
          )}
        </Box>
        <Table
          sx={{
            backgroundColor: "background.paper",
            color: "text.primary",
            "& th": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
              color: (theme) => theme.palette.text.primary,
            },
            "& td": {
              color: (theme) => theme.palette.text.primary,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Medication Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock Status</TableCell>
              <TableCell>Dosage Form</TableCell>
              <TableCell>Dosage Strength</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Prescription Required</TableCell>
              <TableCell>Side Effects</TableCell>
              <TableCell>Usage Instructions</TableCell>
              <TableCell>Available Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMedications.map((medication, index) => {
              const currentUserId = user?.id;
              const userPharmacy = medication.pharmacies.find(
                (pharmacy) => pharmacy?.user_id === currentUserId
              );

              // If the user doesn't own this medication via any pharmacy, skip
              if (!userPharmacy) return null;

              return (
                <TableRow key={index}>
                  <TableCell>
                    <img
                      src={medication.image}
                      alt="No image"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.currentTarget.src = defaultMedicationImage;
                      }}
                    />
                  </TableCell>
                  <TableCell>{medication.name}</TableCell>
                  <TableCell>{medication?.category?.name}</TableCell>
                  <TableCell>{userPharmacy.pivot.price} Birr</TableCell>
                  <TableCell>
                    {userPharmacy.pivot.stock_status
                      ? "In Stock"
                      : "Out of Stock"}
                  </TableCell>
                  <TableCell>{medication.dosage_form}</TableCell>
                  <TableCell>{medication.dosage_strength}</TableCell>
                  <TableCell>{userPharmacy.pivot.manufacturer}</TableCell>
                  <TableCell>{medication.expiry_date}</TableCell>
                  <TableCell>
                    {medication.prescription_required ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={medication.side_effects}>
                      <span className="truncate-tooltip">
                        {medication.side_effects}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={medication.usage_instructions}>
                      <span className="truncate-tooltip">
                        {medication.usage_instructions}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{userPharmacy.pivot.quantity_available}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenForm(medication)}>
                      <Edit />
                    </Button>
                    <Button
                      onClick={() =>
                        handleDeleteClick(medication.id, medication.name)
                      }
                    >
                      <DeleteIcon style={{ color: "red" }} />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredMedications.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />

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
