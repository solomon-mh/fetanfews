import React from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleDelete: () => void;
  itemName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  handleDelete,
  itemName,
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
      <IconButton
          onClick={onClose}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            color:'red',
          }}
        >
          <CloseIcon />
        </IconButton>
        <h2 id="confirmation-modal-title">Confirm Deletion</h2>
        <Typography variant="body1" marginBottom={4}>
        <p id="confirmation-modal-description">
          Are you sure you want to <span style={{ color: "red" }}>delete</span>{" "}
            <strong>{itemName}</strong>? This action cannot be undone.
            </p>
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

export default DeleteModal;
