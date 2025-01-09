import React from "react";
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
} from "@mui/material";
import { pharmacies } from "../../data/pharmacies";
const ManagePharmacies: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Manage Pharmacies
      </Typography>
      <TableContainer component={Paper}>
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
            {pharmacies.map((pharmacy) => (
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
               
                <TableCell>
                  
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginRight: "5px" }}
                  >
                    Edit
                  </Button>
                  <Button variant="contained" color="error" size="small">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManagePharmacies;
