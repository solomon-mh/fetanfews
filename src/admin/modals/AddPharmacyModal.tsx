import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import { AddPharmacyModalProps } from "../../utils/interfaces";
import { pharmacySchema } from "../../utils/validateForm";
const AddPharmacyModal: React.FC<AddPharmacyModalProps> = ({
  openForm,
  handleCloseForm,
  handleInputChange,
  handleSubmit,
  formData,
  isEdit,
}) => {
  const [errors, setErrors] = useState<{
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    operating_hours?: string;
    delivery_available?: string;
    image?: string ;
    longitude?: string;
    latitude?: string;
  }>({});
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 11.5742,
    lng: 37.3614,
  });

  const statuses = ["Pending", "Approved", "Rejected"];
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setSelectedLocation({ lat, lng });

        handleInputChange({
          target: { name: "latitude", value: lat.toString() },
        });
        handleInputChange({
          target: { name: "longitude", value: lng.toString() },
        });
      },
    });

    return (
      <Marker position={selectedLocation}>
        <Popup>Your Location</Popup>
      </Marker>
    );
  };

  const onFormSubmit = () => {
    // Zod validation
    const validation = pharmacySchema.safeParse(formData);

    if (!validation.success) {
      const errorMessages = validation.error.format();
      setErrors({
        name: errorMessages.name?._errors[0] || "",
        address: errorMessages.address?._errors[0] || "",
        phone: errorMessages.phone?._errors[0] || "",
        email: errorMessages.email?._errors[0] || "",
        website: errorMessages.website?._errors[0] || "",
        operating_hours: errorMessages.operating_hours?._errors[0] || "",
        delivery_available: errorMessages.delivery_available?._errors[0] || "",
        image: errorMessages.image?._errors[0] || "",
        longitude: errorMessages.longitude?._errors[0] || "",
        latitude: errorMessages.latitude?._errors[0] || "",
      }
      );

      return;
    }

    // If validation succeeds, proceed with form submission
    setErrors({})
    handleSubmit();
  };

  return (
    <Modal open={openForm} onClose={handleCloseForm}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={handleCloseForm}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: (theme) => theme.palette.error.main,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Modal Content */}
        <Box
          sx={{
            p: 4,
            pt: 6, // Add padding to account for the close button
            overflowY: "auto",
            maxHeight: "100vh", // Make content scrollable if it exceeds the viewport
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {isEdit ? "Edit Pharmacy" : "Add Pharmacy"}
          </Typography>
         
          {/* Basic Details Section */}
          <Typography variant="subtitle1" gutterBottom>
            Basic Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                error={!!errors.website}
                helperText={errors.website}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Operating Hours"
                name="operating_hours"
                value={formData.operating_hours}
                onChange={handleInputChange}
                error={!!errors.operating_hours}
                helperText={errors.operating_hours}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="status"
                name="status"
                select
                value={formData.status}
                onChange={handleInputChange}
                fullWidth
              >
                {statuses && statuses.length > 0 ? (
                  statuses.map((status, index) => (
                    <MenuItem key={index} value={status}>
                      {status}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No status available</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.delivery_available}
                    onChange={handleInputChange}
                    name="delivery_available"
                    color="primary"
                  />
                }
                label="Delivery Available"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Pharmacy Logo
              </Typography>
              <Button
                variant="outlined"
                component="label"
                sx={{ mt: 1, textTransform: "none" }}
              >
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleInputChange}
                  error={!!errors.image}
                  helperText={errors.image}
                />
              </Button>
              {formData.image && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected File: {formData.image.name}
                </Typography>
              )}
            </Grid>
          </Grid>

          {/* Location Details Section */}
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Location Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                error={!!errors.latitude}
                helperText={errors.latitude}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                error={!!errors.longitude}
                helperText={errors.longitude}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Click anywhere on the map to set the pharmacy's location. The
                latitude and longitude fields will be updated automatically.
              </Typography>
              <Box
                sx={{
                  height: "400px",
                  width: "100%",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #ccc",
                }}
              >
                <MapContainer
                  center={[selectedLocation.lat, selectedLocation.lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "8px",
                  }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker />
                </MapContainer>
              </Box>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button onClick={handleCloseForm} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button onClick={onFormSubmit} variant="contained" color="primary">
              {isEdit ? "Update" : "Add"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddPharmacyModal;
