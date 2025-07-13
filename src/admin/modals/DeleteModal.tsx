import React, { useEffect } from "react";
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
  // Optional: Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = () => onClose();
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-md mx-4 sm:mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg p-6"
        onClick={stopPropagation}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 border rounded-full p-1 right-6 text-red-500 hover:text-red-600"
        >
          <CloseIcon />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          Confirm Deletion
        </h2>

        {/* Message */}
        <p className="mb-6 text-center text-lg">
          Are you sure you want to{" "}
          <span className="text-red-500 font-semibold">delete</span>{" "}
          <strong>{itemName}</strong>? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
