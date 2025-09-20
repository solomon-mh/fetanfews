// OrderCard.tsx (or inside a component file)
import React, { useState } from "react";
import { UploadCloud, X } from "lucide-react"; // optional, install lucide-react if not present
import { BaseUrl } from "../utils/BaseUrl";

interface OrderCardProps {
  medicationName: string;
  pharmacyName: string;
  prescriptionRequired: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  medicationName,
  pharmacyName,
  prescriptionRequired,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };
  const clearPreview = () => setPreviewUrl(null);

  const handlePayment = async () => {
    const email = "solomon@gmail.com";
    const current_url = window.location.href;
    const response = await fetch(`${BaseUrl}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, current_url }),
    });

    const data = await response.json();

    if (data.status === "success") {
      window.location.href = data.checkout_url; // redirect to Chapa checkout
    } else {
      alert("Payment initialization failed");
    }
  };

  return (
    <div className="max-w-xl  p-4 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border dark:border-gray-700">
      {/* Order Card */}
      <div className="p-4 mb-4 border border-dashed rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-600">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Order Online
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Medicine: <span className="font-medium">{medicationName}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Pharmacy: <span className="font-medium">{pharmacyName}</span>
        </p>
        <button
          className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition duration-200"
          onClick={handlePayment}
        >
          Order
        </button>
      </div>

      {/* Upload Prescription */}
      {prescriptionRequired && (
        <div className="p-4 border border-dashed rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-600">
          <div className="flex items-center space-x-3">
            <UploadCloud className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Upload Prescription
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            This medication requires a valid prescription.
          </p>
          <label className="block mt-3 cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*, .pdf"
              onChange={handleFileChange}
            />
            <div className="w-full px-4 py-2 text-center bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-600 rounded-lg shadow hover:bg-indigo-50 dark:hover:bg-gray-700 transition duration-200">
              {previewUrl ? "Change File" : "Upload File"}
            </div>
          </label>
          {previewUrl && (
            <div className="relative mt-4">
              <img
                src={previewUrl}
                alt="Prescription Preview"
                className="rounded-lg shadow-md max-h-64 object-cover border dark:border-gray-600"
              />
              <button
                onClick={clearPreview}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                title="Remove"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
