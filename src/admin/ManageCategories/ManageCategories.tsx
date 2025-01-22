/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
  fetchCategoriesData,
  addCategroyData,
  deleteCategroy,
  editCategroy,
} from "../../api/pharmacyService";

type Category = {
  id: number;
  name: string;
  description: string;
};

type FormData = {
  name: string;
  description: string;
};

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({ name: "", description: "" });
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const fetchCategories = async () => {
    try {
      const data = await fetchCategoriesData();
      setCategories(data);
    } catch (error) {
      showSnackbar("Failed to fetch categories.", "error");
    }
  };

  const handleOpenModal = (category: Category | null = null) => {
    if (category) {
      setIsEdit(true);
      setSelectedCategory(category.id);
      setFormData({ name: category.name, description: category.description });
    } else {
      setIsEdit(false);
      setFormData({ name: "", description: "" });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
    setFormData({ name: "", description: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isEdit && selectedCategory) {
        await editCategroy(selectedCategory, formData);
        showSnackbar("Category updated successfully.", "success");
      } else {
        await addCategroyData(formData);
        showSnackbar("Category added successfully.", "success");
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      showSnackbar("Failed to submit the category form.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategroy(id);
        showSnackbar("Category deleted successfully.", "success");
        fetchCategories();
      } catch (error) {
        showSnackbar("Failed to delete the category.", "error");
      }
    }
  };

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ open: true, message, type });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <Box
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
        <Typography variant="h4">Drug Categories</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal()}
          sx={{
            backgroundColor: "green",
            color: "#fff",
            padding: "8px 16px",
            fontWeight: "bold",
            borderRadius: "8px",
          }}
        >
          Add Category
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenModal(category)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(category.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {isEdit ? "Edit Category" : "Add Category"}
          </Typography>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={handleCloseModal} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {isEdit ? "Update" : "Add"}
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={9000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.type} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ManageCategories;
