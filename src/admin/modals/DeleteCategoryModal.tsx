import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface DeleteMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleDelete: () => void;
  CategoryName: string;
}

const DeleteMedicationModal: React.FC<DeleteMedicationModalProps> = ({
  isOpen,
  onClose,
  handleDelete,
  CategoryName,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" marginBottom={2}>
          Delete Medication
        </Typography>
        <Typography variant="body1" marginBottom={4}>
          Are you sure you want to <span style={{color:"red"}}>delete</span> <strong >{CategoryName}</strong>?
        </Typography>
        <Box display="flex" justifyContent="space-around">
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteMedicationModal;
