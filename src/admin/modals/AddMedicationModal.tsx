import React from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";

interface AddMedicationModalProps {
  open: boolean;
  handleClose: () => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  formData: any;
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  open,
  handleClose,
  handleInputChange,
  handleSubmit,
  formData,
}) => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" marginBottom={2}>
          Add Medication
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dosage Form"
              name="dosage_form"
              select
              value={formData.dosage_form}
              onChange={handleInputChange}
              fullWidth
              required
            >
              <MenuItem value="tablet">Tablet</MenuItem>
              <MenuItem value="capsule">Capsule</MenuItem>
              <MenuItem value="syrup">Syrup</MenuItem>
              <MenuItem value="injection">Injection</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dosage Strength"
              name="dosage_strength"
              value={formData.dosage_strength}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Expiry Date"
              name="expiry_date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.expiry_date}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
            >
              Add Medication
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddMedicationModal;
