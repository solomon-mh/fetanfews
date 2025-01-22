import React from "react";
import { Snackbar, Alert } from "@mui/material";

type SnackbarProps = {
  open: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
  autoHideDuration?: number;
};

const SnackbarComponent: React.FC<SnackbarProps> = ({
  open,
  message,
  type,
  onClose,
  autoHideDuration = 6000, 
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
