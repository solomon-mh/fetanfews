/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { medicationSchema } from "../../utils/validateForm";
import { medicationType } from "../../utils/interfaces";
import { CategoryType } from "../../utils/interfaces";
import { fetchCategoriesData } from "../../api/pharmacyService";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
interface AddMedicationModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (validatedData: any) => void;
  medication: medicationType | null;
  isEdit: boolean;
  showSnackbar: (message: string, type: "success" | "error") => void;
}
type FormData = {
  name: string;
  price: number;
  description: string;
  category: string | number;
  dosage_form: string;
  dosage_strength: string;
  manufacturer: string;
  expiry_date: string;
  prescription_required: boolean;
  side_effects: string;
  stock_status: boolean;
  usage_instructions: string;
  quantity_available: number;
  image: string;
};
const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  open,
  handleClose,
  handleSubmit,
  medication,
  isEdit,
  showSnackbar,
}) => {
  const dosageForms = ["Tablet", "Capsule", "Syrup", "Injection"];
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: 1,
    description: "",
    category: "",
    dosage_form: "",
    dosage_strength: "",
    manufacturer: "",
    expiry_date: "",
    prescription_required: false,
    side_effects: "",
    stock_status: true,
    usage_instructions: "",
    quantity_available: 1,
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<CategoryType[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchCategoriesData();
        setCategories(data);
      } catch {
        showSnackbar("Failed to fetch categories.", "error");
      }
    };
    fetchCategories();
  }, [showSnackbar]);

  useEffect(() => {
    if (isEdit && medication) {
      console.log("editing medication", medication.pharmacies[0].pivot.price);

      setFormData({
        name: medication.name,
        price: Number(medication.pharmacies[0].pivot.price),
        description: medication.description,
        category: medication.category.name,
        dosage_form: medication.dosage_form,
        dosage_strength: medication.dosage_strength,
        manufacturer: medication.pharmacies[0].pivot.manufacturer,
        expiry_date: medication.expiry_date,
        prescription_required: medication.prescription_required,
        side_effects: medication.side_effects,
        stock_status: medication.pharmacies[0].pivot.stock_status,
        usage_instructions: medication.usage_instructions,
        quantity_available: Number(
          medication.pharmacies[0].pivot.quantity_available
        ),
        image: medication.image,
      });
    } else {
      setFormData({
        name: "",
        price: 1,
        description: "",
        category: "",
        dosage_form: "",
        dosage_strength: "",
        manufacturer: "",
        expiry_date: "",
        prescription_required: false,
        side_effects: "",
        stock_status: true,
        usage_instructions: "",
        quantity_available: 1,
        image: "",
      });
    }
  }, [isEdit, medication]); // Run only when `isEdit` or `medication` changes

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const medicationUrl = await uploadToCloudinary(file, "medications");
      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        showSnackbar("Please upload a valid image file.", "error");
        return;
      }

      setFormData({ ...formData, image: medicationUrl });
    }
  };
  const handleBackdropClick = () => handleClose();

  const validateAndSubmit = () => {
    const parsed = medicationSchema.safeParse({
      ...formData,
      price: Number(formData.price),
      quantity_available: Number(formData.quantity_available),
      stock_status: true,
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
      setFormData({
        name: "",
        price: 1,
        description: "",
        category: "",
        dosage_form: "",
        dosage_strength: "",
        manufacturer: "",
        expiry_date: "",
        prescription_required: false,
        side_effects: "",
        stock_status: false,
        usage_instructions: "",
        quantity_available: 1,
        image: "",
      });
    }
  };
  return (
    <div
      className={`${
        open ? "flex" : "hidden"
      } fixed inset-0 z-30 items-center justify-center bg-black/50`}
      onClick={handleBackdropClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl p-8 relative shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isEdit ? "Edit Medication" : "Add Medication"}
        </h2>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-red-600 hover:text-white hover:bg-red-600 transition rounded-full"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Input and Select fields */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Medication name"
              className={`w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.name && "border-red-500"
              }`}
              required
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: Number(e.target.value),
                })
              }
              className={`w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.category && "border-red-500"
              }`}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Price (Birr)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.price && "border-red-500"
              }`}
              required
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Quantity Available
            </label>
            <input
              type="number"
              name="quantity_available"
              value={formData.quantity_available}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.quantity_available && "border-red-500"
              }`}
              required
            />
            {errors.quantity_available && (
              <p className="text-xs text-red-500 mt-1">
                {errors.quantity_available}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Dosage Form
            </label>
            <select
              name="dosage_form"
              value={formData.dosage_form}
              onChange={handleSelectChange}
              className={`w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.dosage_form && "border-red-500"
              }`}
              required
            >
              <option value="">Select dosage form</option>
              {dosageForms.map((form) => (
                <option key={form} value={form}>
                  {form}
                </option>
              ))}
            </select>
            {errors.dosage_form && (
              <p className="text-xs text-red-500 mt-1">{errors.dosage_form}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Dosage Strength
            </label>
            <input
              type="text"
              name="dosage_strength"
              value={formData.dosage_strength}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.dosage_strength && "border-red-500"
              }`}
              required
            />
            {errors.dosage_strength && (
              <p className="text-xs text-red-500 mt-1">
                {errors.dosage_strength}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Manufacturer
            </label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.manufacturer && "border-red-500"
              }`}
              required
            />
            {errors.manufacturer && (
              <p className="text-xs text-red-500 mt-1">{errors.manufacturer}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.expiry_date && "border-red-500"
              }`}
              required
            />
            {errors.expiry_date && (
              <p className="text-xs text-red-500 mt-1">{errors.expiry_date}</p>
            )}
          </div>

          <div className="flex items-center gap-2 col-span-2">
            <input
              type="checkbox"
              name="prescription_required"
              checked={formData.prescription_required}
              onChange={handleSwitchChange}
            />
            <label className="text-sm">Prescription Required</label>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Upload Image
            </label>
            <input type="file" name="image" onChange={handleImageChange} />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Side Effects
            </label>
            <textarea
              name="side_effects"
              rows={3}
              value={formData.side_effects}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.side_effects && "border-red-500"
              }`}
            />
            {errors.side_effects && (
              <p className="text-xs text-red-500 mt-1">{errors.side_effects}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Usage Instructions
            </label>
            <textarea
              name="usage_instructions"
              rows={3}
              value={formData.usage_instructions}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.usage_instructions && "border-red-500"
              }`}
            />
            {errors.usage_instructions && (
              <p className="text-xs text-red-500 mt-1">
                {errors.usage_instructions}
              </p>
            )}
          </div>
        </form>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-6 w-full py-2 border border-red-500 text-red-500 hover:bg-red-100 dark:hover:bg-red-300 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={validateAndSubmit}
            className="px-6 w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
          >
            {isEdit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMedicationModal;
