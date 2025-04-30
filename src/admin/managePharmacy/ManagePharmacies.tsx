/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";

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
	InputAdornment,
	TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Edit } from "@mui/icons-material";
import AddPharmacyModal from "../modals/AddPharmacyModal";
import DeleteModal from "../modals/DeleteModal";
import SearchIcon from "@mui/icons-material/Search";
import { pharmacyFormData, pharmacyType } from "../../utils/interfaces";
import {
	addPharmacy,
	fetchPharmacyData,
	editPharmacy,
	deletePharmacy,
} from "../../api/pharmacyService";

import SnackbarComponent from "../modals/SnackbarComponent";
const ManagePharmacies: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [pharmacies, setPharmacies] = useState<pharmacyType[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [openForm, setOpenForm] = useState<boolean>(false);
	const [isDelModalOpen, setIsDelModalOpen] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<number>(0);
	const [pharmacyName, setPharmacyName] = useState<string>("");

	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [selectedPharmacy, setSelectedPharmacy] = useState<pharmacyType | null>(
		null
	);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		type: "success" as "success" | "error",
	});
	const showSnackbar = (message: string, type: "success" | "error") => {
		setSnackbar({ open: true, message, type });
	};
	const closeSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const [formData, setFormData] = useState<pharmacyFormData>({
		name: "",
		address: "",
		phone: "",
		email: "",
		website: "",
		operating_hours: "",
		delivery_available: false,
		status: "",
		latitude: "",
		longitude: "",
		image: null,
	});

	const fetchPharmacy = async () => {
		try {
			const data = await fetchPharmacyData();
			setPharmacies(data);
		} catch (error) {
			showSnackbar("Failed to fetch medications.", "error");
		}
	};
	// Handle form open/close
	const handleOpenForm = (pharmacy: pharmacyType | null = null) => {
		if (pharmacy) {
			setIsEdit(true);
			setSelectedPharmacy(pharmacy);

			// Populate formData with the selected pharmacy details
			setFormData({
				name: pharmacy.name || "",
				address: pharmacy.address || "",
				phone: pharmacy.phone || "",
				email: pharmacy.email || "",
				website: pharmacy.website || "",
				operating_hours: pharmacy.operating_hours || "",
				delivery_available: pharmacy.delivery_available || false,
				status: pharmacy.status || "",
				latitude: pharmacy.latitude.toString() || "",
				longitude: pharmacy.longitude.toString() || "",
				image: null,
			});
		} else {
			setIsEdit(false);
			setSelectedPharmacy(null);

			// Clear formData for a new entry
			setFormData({
				name: "",
				address: "",
				phone: "",
				email: "",
				website: "",
				operating_hours: "",
				delivery_available: false,
				latitude: "",
				longitude: "",
				image: null,
				status: "",
			});
		}
		setOpenForm(true);
	};

	const handleCloseForm = () => {
		setOpenForm(false);

		// Reset formData to its initial state
		setFormData({
			name: "",
			address: "",
			phone: "",
			email: "",
			website: "",
			operating_hours: "",
			delivery_available: false,
			latitude: "",
			longitude: "",
			image: null,
			status: "",
		});
	};
	const handleInputChange = (
		event:
			| React.ChangeEvent<HTMLInputElement>
			| {
					target: {
						name: string;
						value: string;
						checked?: boolean;
						type?: string;
						files?: FileList | null;
					};
			  }
	) => {
		const { name, value, checked, type, files } = event.target;

		setFormData((prevData) => ({
			...prevData,
			[name]:
				type === "checkbox" ? checked : type === "file" ? files?.[0] : value,
		}));
	};

	// Handle form submission
	const handleSubmit = async () => {
		try {
			if (isEdit && selectedPharmacy) {
				await editPharmacy(selectedPharmacy.id, formData);
				showSnackbar("Pharmacy updated successfully.", "success");
			} else {
				await addPharmacy(formData);
				showSnackbar("Pharmacy added successfully.", "success");
			}
			fetchPharmacy();
			handleCloseForm();
		} catch (error: any) {
			// Check if response exists and contains 'email' unique error
			if (error.response && error.response.data) {
				const responseData = error.response.data;

				if (
					responseData.email &&
					responseData.email.includes(
						"pharmacy with this email already exists."
					)
				) {
					showSnackbar(
						"This email is already registered. Please use a different one.",
						"error"
					);
				} else {
					showSnackbar("Failed to submit the Pharmacy data.", "error");
				}
			} else {
				showSnackbar(
					"An unexpected error occurred. Please try again.",
					"error"
				);
			}
		}
	};

	// Filter pharmacies based on search query
	const filteredPharmacies = (pharmacies || []).filter(
		(pharmacy) =>
			pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
	const handleDeleteClick = (id: number, name: string) => {
		setDeleteId(id);
		setPharmacyName(name);
		setIsDelModalOpen(true);
	};
	const handleDelModalClose = () => {
		setIsDelModalOpen(false);
	};
	const handleDelete = async () => {
		try {
			await deletePharmacy(deleteId);
			showSnackbar("Pharmacy deleted successfully.", "success");
			fetchPharmacy();
		} catch (error) {
			showSnackbar("Failed to delete the pharmacy.", "error");
		}
		setIsDelModalOpen(false);
	};

	useEffect(() => {
		fetchPharmacy();
	}, []);
	return (
		<>
			<div className="manage-pharmacies">
				<Box className="top-section">
					<Typography className="title" variant="h4" gutterBottom>
						Manage Pharmacies
					</Typography>
					<TextField
						className="search-bar"
						label="Search Pharmacies"
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
					<Button
						className="add-button"
						variant="contained"
						color="primary"
						size="large"
						onClick={() => handleOpenForm()}
					>
						Add Pharmacy
					</Button>
				</Box>

				<TableContainer className="table-container" component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Pharmacy</TableCell>
								<TableCell>Address</TableCell>
								<TableCell>Phone Number</TableCell>
								<TableCell>email</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Oprating hour</TableCell>
								<TableCell>Delivery avliable</TableCell>
								<TableCell>Latitude</TableCell>
								<TableCell>Logitude</TableCell>
								<TableCell>WebSite</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedPharmacies.map((pharmacy: pharmacyType) => (
								<TableRow key={pharmacy.id}>
									<TableCell sx={{ display: "flex", gap: "10px" }}>
										<img
											src={`http://127.0.0.1:8000${pharmacy.image}`} // Ensure full URL
											alt="No image"
											style={{
												width: "50px",
												height: "50px",
												objectFit: "cover",
											}}
										/>{" "}
										{pharmacy.name}
									</TableCell>
									<TableCell>{pharmacy.address}</TableCell>

									<TableCell>{pharmacy.phone}</TableCell>

									<TableCell>{pharmacy.email}</TableCell>
									<TableCell>{pharmacy.status}</TableCell>
									<TableCell>{pharmacy.operating_hours}</TableCell>
									<TableCell>
										{pharmacy.delivery_available ? "Yes" : "No"}
									</TableCell>
									<TableCell>{pharmacy.latitude}</TableCell>
									<TableCell>{pharmacy.longitude}</TableCell>
									<TableCell>{pharmacy.website}</TableCell>
									<TableCell className="action-buttons">
										<Button
											className="edit"
											style={{ marginRight: "5px" }}
											title={`Edit ${pharmacy.name}`}
											onClick={() => handleOpenForm(pharmacy)}
										>
											<Edit />
										</Button>
										<Button
											className="delete"
											onClick={() =>
												handleDeleteClick(pharmacy.id, pharmacy.name)
											}
											title={`Delete ${pharmacy.name}`}
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
				isEdit={isEdit}
			/>
			<DeleteModal
				isOpen={isDelModalOpen}
				onClose={handleDelModalClose}
				handleDelete={handleDelete}
				itemName={pharmacyName}
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

export default ManagePharmacies;
