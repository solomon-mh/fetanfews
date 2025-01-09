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

const ManagePharmacies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const [pharmacies, setPharmacies] = useState(pharmacyData); // Pharmacy list
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

  // Filter pharmacies based on search query
  const filteredPharmacies = pharmacies.filter(
    (pharmacy) =>
      pharmacy.pharmacy_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  return (
    <div className="manage-pharmacies">
      <Box className="top-section">
        <Typography className="title" variant="h4" gutterBottom>
          Manage Pharmacies
        </Typography>
        <Button className="add-button" variant="contained" color="primary" size="large">
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
    </div>
  );
};

export default ManagePharmacies;
