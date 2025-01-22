/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { medicationSchema } from "../../utils/validateForm";

interface AddMedicationModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (validatedData: any) => void;
  categories: { id: number; name: string }[];
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  open,
  handleClose,
  handleSubmit,
  categories,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    description: string;
    category: string;
    dosage_form: string;
    dosage_strength: string;
    manufacturer: string;
    expiry_date: string;
    prescription_required: boolean;
    side_effects: string;
    usage_instructions: string;
    quantity_available: string;
    image: File | null;
  }>({
    name: "",
    price: "",
    description: "",
    category: "",
    dosage_form: "",
    dosage_strength: "",
    manufacturer: "",
    expiry_date: "",
    prescription_required: false,
    side_effects: "",
    usage_instructions: "",
    quantity_available: "",
    image: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({ ...formData, image: event.target.files[0] });
    }
  };

  const validateAndSubmit = () => {
    const parsed = medicationSchema.safeParse({
      ...formData,
      price: Number(formData.price),
      quantity_available: Number(formData.quantity_available),
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      handleSubmit(parsed.data);
    }
  };

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
    maxHeight: "90vh",
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" marginBottom={2}>
          Add Medication
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: (theme) => theme.palette.error.main,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Category"
              name="category"
              select
              value={formData.category}
              onChange={handleInputChange}
              fullWidth
              error={!!errors.category}
              helperText={errors.category}
            >
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No categories available</MenuItem>
              )}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quantity Available"
              name="quantity_available"
              type="number"
              value={formData.quantity_available}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.quantity_available}
              helperText={errors.quantity_available}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Dosage Form"
              name="dosage_form"
              select
              value={formData.dosage_form}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.dosage_form}
              helperText={errors.dosage_form}
            >
              <MenuItem value="tablet">Tablet</MenuItem>
              <MenuItem value="capsule">Capsule</MenuItem>
              <MenuItem value="syrup">Syrup</MenuItem>
              <MenuItem value="injection">Injection</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dosage Strength"
              name="dosage_strength"
              value={formData.dosage_strength}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.dosage_strength}
              helperText={errors.dosage_strength}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.manufacturer}
              helperText={errors.manufacturer}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Expiry Date"
              name="expiry_date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.expiry_date}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.expiry_date}
              helperText={errors.expiry_date}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.prescription_required}
                  onChange={handleSwitchChange}
                  name="prescription_required"
                />
              }
              label="Prescription Required"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            Upload Image
            <input type="file" name="image" onChange={handleImageChange} />
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Side Effects"
              name="side_effects"
              value={formData.side_effects}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
              error={!!errors.side_effects}
              helperText={errors.side_effects}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Usage Instructions"
              name="usage_instructions"
              value={formData.usage_instructions}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
              error={!!errors.usage_instructions}
              helperText={errors.usage_instructions}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button onClick={handleClose} sx={{ mr: 2, color:"red" }}
>
            Cancel
          </Button>
          <Button
            onClick={validateAndSubmit}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddMedicationModal;
