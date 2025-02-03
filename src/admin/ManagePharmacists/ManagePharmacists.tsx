import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Modal,
  TextField,
  Box,
  Typography,
  Autocomplete,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
  fetchPharmacistsData,
  addPharmacistData,
  deletePharmacist,
  editPharmacist,
  fetchPharmacyData,
} from "../../api/pharmacyService";
import { fetchUsers } from "../../api/auth";
import SnackbarComponent from "../modals/SnackbarComponent";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import DeleteModal from "../modals/DeleteModal";

type FormData = {
  user: string;
  pharmacy: string;
  license_number: string;
  license_image?: File | null;
};

const ManagePharmacists: React.FC = () => {
  const [pharmacists, setPharmacists] = useState([]);
  const [filteredPharmacists, setFilteredPharmacists] = useState([]);
  const [users, setUsers] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const[pharmacistName,setPharmacistName]=useState<string>('')
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    user: "",
    pharmacy: "",
    license_number: "",
    license_image: null,
  });
  const [selectedPharmacist, setSelectedPharmacist] = useState<number | null>(
    null
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const [searchQuery, setSearchQuery] = useState(""); 
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDelModalOpen, setIsDelModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchPharmacists();
    fetchUsersData();
    fetchPharmacies();
  }, []);

  useEffect(() => {
    console.log("pharmasist",pharmacists)
    // Filter pharmacists based on search query
    const filtered = pharmacists.filter(
      (pharmacist) =>
        pharmacist.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacist.pharmacy_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacist.license_number
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
    setFilteredPharmacists(filtered);
  }, [searchQuery, pharmacists]);

  const fetchPharmacists = async () => {
    try {
      const data = await fetchPharmacistsData();
      setPharmacists(data);
    } catch (error) {
      showSnackbar("Failed to fetch pharmacists.", "error");
    }
  };

  const fetchUsersData = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      showSnackbar("Failed to fetch users.", "error");
    }
  };

  const fetchPharmacies = async () => {
    try {
      const data = await fetchPharmacyData();
      setPharmacies(data);
    } catch (error) {
      showSnackbar("Failed to fetch pharmacies.", "error");
    }
  };

  const handleOpenModal = (pharmacist = null) => {
    if (pharmacist) {
      setIsEdit(true);
      setSelectedPharmacist(pharmacist.id);
      setFormData({
        user: pharmacist.user_name,
        pharmacy: pharmacist.pharmacy_name,
        license_number: pharmacist.license_number,
        license_image: null, // License image is not editable
      });
    } else {
      setIsEdit(false);
      setFormData({
        user: "",
        pharmacy: "",
        license_number: "",
        license_image: null,
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPharmacist(null);
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("user", formData.user?.id || "");
      data.append("pharmacy", formData.pharmacy?.id || "");
      data.append("license_number", formData.license_number);
      if (formData.license_image) {
        data.append("license_image", formData.license_image);
      }

      if (isEdit && selectedPharmacist) {
        await editPharmacist(selectedPharmacist, data);
        showSnackbar("Pharmacist updated successfully.", "success");
      } else {
        await addPharmacistData(data);
        showSnackbar("Pharmacist added successfully.", "success");
      }
      fetchPharmacists();
      handleCloseModal();
    } catch (error) {
      showSnackbar(`Failed to submit pharmacist data. ${error.response?.data?.message || error.message}`, "error");
    }
  };
  const handleDeleteClick = (id: number, name: string) => {
    setSelectedPharmacist(id);
    setPharmacistName(name);
    setIsDelModalOpen(true);
  };
  const handleDelModalClose = () => {
    setIsDelModalOpen(false);
  };
  const handleDelete = async () => {
    if (selectedPharmacist) {
      try {
        await deletePharmacist(selectedPharmacist);
        showSnackbar("Pharmacist deleted successfully.", "success");
        fetchPharmacists();
      } catch (error) {
        showSnackbar("Failed to delete the pharmacist.", "error");
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
  };

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ open: true, message, type });
  };

  return (
    <div className="manage-pharmacists">
      <Box
        className="manage-header"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          background: "white",
        }}
      >
        <Typography variant="h4">Manage Pharmacists</Typography>

        <TextField
          className="search-bar"
          label="Search"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            marginRight: "1rem",
            marginLeft: "auto",
            background: "white",
            width: "30%",
          }}
        />
        <Button variant="contained" onClick={() => handleOpenModal()}>
          Add Pharmacist
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pharmacist</TableCell>
              <TableCell>Pharmacy</TableCell>
              <TableCell>License Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPharmacists
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((pharmacist) => (
                <TableRow key={pharmacist.id}>
                  <TableCell>{pharmacist.user_name}</TableCell>
                  <TableCell>{pharmacist.pharmacy_name}</TableCell>
                  <TableCell>{pharmacist.license_number}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleOpenModal(pharmacist)}
                      title={`Edit ${pharmacist.user_name}`}
                    >
                      <Edit />
                    </Button>
                    <Button
                      style={{
                        color: "red",
                      }}
                      onClick={() => handleDeleteClick(pharmacist.id, pharmacist.user_name)}
                      title={`Delete ${pharmacist.user_name}`}>
                      <Delete />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPharmacists.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          className="modal-content"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 300, sm: 400 }, // Responsive width
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2, // Smooth corners
            display: "flex",
            flexDirection: "column",
            gap: 2, // Spacing between elements
          }}
        >
            <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: (theme) => theme.palette.error.main,
          }}
        >
          <CloseIcon />
        </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 2,
              textAlign: "center", // Center-align header
              color: "text.primary", // Accessible color
            }}
          >
            {isEdit ? "Edit Pharmacist" : "Add Pharmacist"}
          </Typography>
          <Autocomplete
            options={users}
            getOptionLabel={(option) => option.email || formData.user}
            value={formData.user || null}
            onChange={(event, value) =>
              setFormData({ ...formData, user: value ? value : "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="User" required />
            )}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />

          <Autocomplete
            options={Array.isArray(pharmacies) ? pharmacies : []}
            getOptionLabel={(option) => option?.name || formData.pharmacy}
            value={formData.pharmacy || null}
            onChange={(event, value) =>
              setFormData({ ...formData, pharmacy: value || "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Pharmacy" required />
            )}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />

          <TextField
            name="license_number"
            label="License Number"
            value={formData.license_number}
            onChange={(e) =>
              setFormData({ ...formData, license_number: e.target.value })
            }
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />
          {!isEdit && (
            <Box
              sx={{
                border: "1px dashed gray",
                borderRadius: 1,
                padding: 2,
                textAlign: "center",
                bgcolor: "action.hover",
                position: "relative",
              }}
            >
              {formData.license_image ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <img
                    src={URL.createObjectURL(formData.license_image)}
                    alt="Selected"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      setFormData({ ...formData, license_image: null })
                    }
                  >
                    Remove
                  </Button>
                </Box>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        license_image: e.target.files?.[0] || null,
                      })
                    }
                    style={{
                      cursor: "pointer",
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                    }}
                  />
                  <Typography variant="body2" sx={{ pointerEvents: "none" }}>
                    Click to upload License Image
                  </Typography>
                </>
              )}
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              onClick={handleCloseModal}
              sx={{
                color: "red",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                textTransform: "none",
                bgcolor: "primary.main",
                ":hover": { bgcolor: "primary.dark" },
              }}
            >
              {isEdit ? "Update" : "Add"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
        <DeleteModal
        isOpen={isDelModalOpen}
        onClose={handleDelModalClose}
        handleDelete={handleDelete}
        itemName={pharmacistName}
      />
    </div>
  );
};

export default ManagePharmacists;
