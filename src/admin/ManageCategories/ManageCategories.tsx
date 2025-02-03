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
  InputAdornment,
  TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
  fetchCategoriesData,
  addCategroyData,
  deleteCategroy,
  editCategroy,
} from "../../api/pharmacyService";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import { CategoryType } from "../../utils/interfaces";
import SnackbarComponent from "../modals/SnackbarComponent";
import DeleteModal from "../modals/DeleteModal";

type FormData = {
  name: string;
  description: string;
};

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isDelModalOpen, setIsDelModalOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [errors, setErrors] = useState({ name: "", description: "" });
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

  const handleOpenModal = (category: CategoryType | null = null) => {
    setErrors({ name: "", description: "" });
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
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
    }
  };
  const handleDeleteClick = (id: number, name: string) => {
    setSelectedCategory(id);
    setCategoryName(name);
    setIsDelModalOpen(true);
  };
  const handleDelModalClose = () => {
    setIsDelModalOpen(false);
  };
  const handleDelete = async () => {
    if (selectedCategory) {
      try {
        await deleteCategroy(selectedCategory);
        showSnackbar("Category deleted successfully.", "success");
        fetchCategories();
      } catch (error) {
        showSnackbar("Failed to delete the category.", "error");
      }
    }
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

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const validateInputs = () => {
    let valid = true;
    const tempErrors = { name: "", description: "" };

    if (!formData.name) {
      tempErrors.name = "Name is required";
      valid = false;
    } else if (formData.name.length < 3) {
      tempErrors.name = "Name must be at least 3 characters";
      valid = false;
    } else if (formData.name.length > 50) {
      tempErrors.name = "Name must be less than 50 characters";
      valid = false;
    }

    if (!formData.description) {
      tempErrors.description = "Description is required";
      valid = false;
    } else if (formData.description.length < 10) {
      tempErrors.description = "Description must be at least 10 characters";
      valid = false;
    } else if (formData.description.length > 200) {
      tempErrors.description = "Description must be less than 200 characters";
      valid = false;
    }
    setErrors(tempErrors);
    return valid;
  };
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <TextField
          className="search-bar"
          label="Search "
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
          sx={{
            marginRight: "1rem",
            marginLeft: "auto",
            background: "white",
            width: "30%",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal()}
          sx={{
            backgroundColor: "green",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: "500",
            textTransform: "uppercase",
            padding: "10px 20px",
            borderRadius: "50px",
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
            {filteredCategories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenModal(category)}
                    >
                      <Edit />
                    </IconButton>
                    <Button
                      style={{ color:"red" }}
                      onClick={() =>
                        handleDeleteClick(category.id, category.name)
                      }
                    >
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
        count={filteredCategories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
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
            error={!!errors.name}
            helperText={errors.name}
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
            error={!!errors.description}
            helperText={errors.description}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={handleCloseModal} sx={{ mr: 1,color:"red" }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {isEdit ? "Update" : "Add"}
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Snackbar */}
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
      <DeleteModal
        isOpen={isDelModalOpen}
        onClose={handleDelModalClose}
        handleDelete={handleDelete}
        itemName={categoryName}
      />
    </div>
  );
};

export default ManageCategories;
