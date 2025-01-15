import React, { useState } from "react";
import "./ManagePharmacies.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Box,
  TablePagination,
} from "@mui/material";
import { pharmacies as pharmacyData } from "../../data/pharmacies";
import DeleteIcon from "@mui/icons-material/Delete";
import { Edit } from "@mui/icons-material";
import AddPharmacyModal from "../modals/AddPharmacyModal";
import DeleteModal from "../modals/DeletePharmacy";
const ManagePharmacies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pharmacies, setPharmacies] = useState(pharmacyData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    operating_hours: "",
    latitude: "",
    longitude: "",
  });

  // Handle form open/close
  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => {
    setOpenForm(false);
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      operating_hours: "",
      latitude: "",
      longitude: "",
    });
  };

  // Handle form input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the specific field
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (formData.name && formData.address && formData.phone && formData.email) {
      setPharmacies([...pharmacies, { ...formData, pharmacy_id: Date.now() }]);
      handleCloseForm();
    } else {
      alert("Please fill in all required fields.");
    }
  };

  // Filter pharmacies based on search query
  const filteredPharmacies = pharmacies.filter(
    (pharmacy) =>
      pharmacy.pharmacy_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate the filtered pharmacies
  const paginatedPharmacies = filteredPharmacies.slice(
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
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsDelModalOpen(true);
  };
  const handleDelModalClose = () => {
    setIsDelModalOpen(false);
  };
  const handleDelete = () => {
    setIsDelModalOpen(false);

    alert(`${deleteId} delated successfully`);
  };
  return (
    <>
      <div className="manage-pharmacies">
        <Box className="top-section">
          <Typography className="title" variant="h4" gutterBottom>
            Manage Pharmacies
          </Typography>
          <Button
            className="add-button"
            variant="contained"
            color="primary"
            size="large"
            onClick={handleOpenForm}
          >
            Add Pharmacy
          </Button>
        </Box>
        <TextField
          className="search-bar"
          label="Search Pharmacies"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <TableContainer className="table-container" component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Pharmacy Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPharmacies.map((pharmacy) => (
                <TableRow key={pharmacy.pharmacy_id}>
                  <TableCell>
                    <Avatar
                      src={pharmacy.image}
                      alt={pharmacy.pharmacy_name}
                      sx={{ width: 56, height: 56 }}
                    />
                  </TableCell>
                  <TableCell>{pharmacy.pharmacy_name}</TableCell>
                  <TableCell>{pharmacy.address}</TableCell>
                  <TableCell className="action-buttons">
                    <Button
                      className="edit"
                      style={{ marginRight: "5px" }}
                      title={`Edit ${pharmacy.pharmacy_name}`}
                    >
                      <Edit />
                    </Button>
                    <Button
                      className="delete"
                      onClick={() => handleDeleteClick(pharmacy.pharmacy_id)}
                      title={`Delete ${pharmacy.pharmacy_name}`}
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
          count={filteredPharmacies.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Form Modal */}
      </div>
      <AddPharmacyModal
        openForm={openForm}
        handleCloseForm={handleCloseForm}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        formData={formData}
      />
      <DeleteModal
        isOpen={isDelModalOpen}
        onClose={handleDelModalClose}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default ManagePharmacies;
