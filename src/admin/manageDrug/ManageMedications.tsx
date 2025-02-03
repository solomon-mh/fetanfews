/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import "./ManageMedications.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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

const ManageMedications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [medications, setMedications] = useState<medicationType[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ open: true, message, type });
  };
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

  const fetchMedications = async () => {
    try {
      const data = await fetchMedicationsData();
      setMedications(data);
      console.log("medaction from manage", data);
    } catch (error) {
      showSnackbar("Failed to fetch medications.", "error");
    }
  };

  // Handle form submission
  const handleSubmit = async (data: any) => {
    try {
      if (isEdit && selectedMedication) {
        await editMedication(selectedMedication.id, data);
        showSnackbar("Medication updated successfully.", "success");
      } else {
        await addMedicationData(data);
        showSnackbar("Medication added successfully.", "success");
      }
      fetchMedications();
      handleCloseForm();
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
    }
  };

  // Filter medications based on search query
  const filteredMedications = medications.filter(
    (medication) =>
      medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (medication.category_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Paginate the filtered medications
  const paginatedMedications = filteredMedications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
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
  }, []);

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

        <TableContainer className="table-container" component={Paper}>
          <Table>
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
              {paginatedMedications.map((medication) => (
                <TableRow key={medication.id}>
                  <TableCell>
                    <img
                      src={`http://127.0.0.1:8000${medication.image}`} // Ensure full URL
                      alt="No image"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                  <TableCell>{medication.name}</TableCell>
                  <TableCell>{medication.category_name}</TableCell>
                  <TableCell>{medication.price} Birr</TableCell>
                  <TableCell>
                    {medication.stock_status ? "In Stock" : "Out of Stock"}
                  </TableCell>
                  <TableCell>{medication.dosage_form}</TableCell>
                  <TableCell>{medication.dosage_strength}</TableCell>
                  <TableCell>{medication.manufacturer}</TableCell>
                  <TableCell>{medication.expiry_date}</TableCell>
                  <TableCell>
                    {medication.prescription_required ? "Yes" : "NO"}
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={medication.side_effects}
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: "#fff",
                            color: "#333",
                            fontSize: "0.875rem",
                            padding: "10px",
                            maxWidth: "300px",
                            whiteSpace: "normal",
                            textAlign: "center",
                          },
                        },
                      }}
                    >
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "block",
                          maxWidth: "200px",
                        }}
                      >
                        {medication.side_effects}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={medication.usage_instructions}
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: "#fff",
                            color: "#333",
                            fontSize: "0.875rem",
                            padding: "10px",
                            maxWidth: "300px",
                            whiteSpace: "normal",
                            textAlign: "center",
                          },
                        },
                      }}
                    >
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "block",
                          maxWidth: "200px",
                        }}
                      >
                        {medication.usage_instructions}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{medication.quantity_available}</TableCell>
                  <TableCell className="action-buttons">
                    <Button
                      className="edit"
                      style={{ marginRight: "5px" }}
                      title={`Edit ${medication.name}`}
                      onClick={() => handleOpenForm(medication)}
                    >
                      <Edit />
                    </Button>
                    <Button
                      className="delete"
                      onClick={() =>
                        handleDeleteClick(medication.id, medication.name)
                      }
                      title={`Delete ${medication.name}`}
                    >
                      <DeleteIcon style={{ color: "red" }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredMedications.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Form Modal */}
      </div>
      <AddMedicationModal
        open={openForm}
        handleClose={handleCloseForm}
        handleSubmit={handleSubmit}
        medication={selectedMedication}
        isEdit={isEdit}
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
