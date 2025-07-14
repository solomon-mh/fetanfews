/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { TablePagination } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
  fetchCategoriesData,
  addCategroyData,
  deleteCategroy,
  editCategroy,
} from "../../api/pharmacyService";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import { CategoryType, UserRole } from "../../utils/interfaces";
import SnackbarComponent from "../modals/SnackbarComponent";
import DeleteModal from "../modals/DeleteModal";
import { useAuth } from "../../contexts/AuthContext";
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
  const { user } = useAuth();
  const fetchCategories = useCallback(async () => {
    try {
      const data = await fetchCategoriesData();
      setCategories(data);
    } catch (error) {
      showSnackbar("Failed to fetch categories.", "error");
    }
  }, []);

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
        handleCloseModal();
      } catch (error) {
        showSnackbar("Failed to delete the category.", "error");
        handleCloseModal();
      }
    }
  };
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
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
  }, [fetchCategories]);

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
    <div className="w-full">
      <div className="w-full mb-4 flex flex-col md:flex-row items-center gap-4 max-w-d mx-auto md:p-4 rounded-xl bg-white dark:bg-gray-900 shadow-md">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Drug Categories
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
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-200"
            />
          </div>
          {user?.role === UserRole.PHARMACIST && (
            <button
              onClick={() => handleOpenModal()}
              className="bg-gray-600 cursor-pointer hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200"
            >
              Add Category
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-md bg-white dark:bg-gray-800">
        <table className="min-w-full table-auto text-sm text-left text-gray-800 dark:text-gray-100">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Description</th>
              {user?.role === "admin" && (
                <th className="px-4 py-3 font-semibold">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {filteredCategories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((category, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3">{category.name}</td>
                  <td className="px-4 py-3">{category.description}</td>
                  {user?.role === "admin" && (
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => handleOpenModal(category)}
                        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick(category.id, category.name)
                        }
                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300 transition"
                      >
                        <Delete className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {filteredCategories.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            mt: 2,
            backgroundColor: "background.paper",
            borderRadius: "12px",
            boxShadow: 2,
          }}
          className="dark:bg-gray-700 dark:text-white"
        />
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 border rounded-full p-1 right-6 text-red-500 hover:text-red-600"
            >
              <CloseIcon />
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              {isEdit ? "Edit Category" : "Add Category"}
            </h2>

            {/* Name Input */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.description
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                required
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseModal}
                className="w-full  mr-2 px-4 py-2 text-sm text-red-600 hover:text-red-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-200"
              >
                {isEdit ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Snackbar */}
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={closeSnackbar}
      />

      {/* Delete Modal */}
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
