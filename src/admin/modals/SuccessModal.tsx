import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface SuccessModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, message, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="success-modal" aria-describedby="success-message">
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
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography id="success-modal" variant="h6" component="h2" sx={{ mb: 2 }}>
          Success!
        </Typography>
        <Typography id="success-message" sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Button variant="contained" color="primary" onClick={onClose}>
          OK
        </Button>
      </Box>
    </Modal>
  );
};

export default SuccessModal;
