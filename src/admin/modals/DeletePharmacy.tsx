import { Modal, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { DelatePharmacyProps } from "../../utils/interfaces";

const DeleteModal: React.FC<DelatePharmacyProps> = ({
  isOpen,
  onClose,
  handleDelete,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <div
        style={{
          position: "relative",
          padding: "20px",
          background: "white",
          borderRadius: "8px",
          maxWidth: "400px",
          margin: "100px auto",
        }}
      >
        <h2 id="confirmation-modal-title">Confirm Deletion</h2>
        <p id="confirmation-modal-description">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
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
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          style={{ color: "red" }}
          color="secondary"
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};
export default DeleteModal;
