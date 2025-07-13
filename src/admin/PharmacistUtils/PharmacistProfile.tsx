/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { editPharmacy, getPharmacyInfo } from "../../api/pharmacyService";
import SnackbarComponent from "../modals/SnackbarComponent";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePharmacySchema } from "../../utils/validateForm";
import { useAuth } from "../../contexts/AuthContext";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
interface PharmacyFormValues {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  operating_hours: string;
  image?: File;
  delivery_available: string;
  license_number: string;
  license_image?: File;
  is_verified?: boolean;
}
const PharmacistProfile = () => {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [pharmacy, setPharmacy] = useState<
    PharmacyFormValues & { id: number }
  >();
  const [loading, setLoading] = useState(false);
  const [licenseImagePreview, setLicenseImagePreview] = useState<string | null>(
    null
  );
  const [pharmacyImagePreview, setPharmacyImagePreview] = useState<
    string | null
  >(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const showSnackbar = useCallback(
    (message: string, type: "success" | "error") => {
      setSnackbar({ open: true, message, type });
    },
    []
  );
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PharmacyFormValues>({
    resolver: zodResolver(updatePharmacySchema),
    defaultValues: {
      delivery_available: "",
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return null;
        const pharmacy = await getPharmacyInfo(user.id);
        setPharmacy(pharmacy);
        setLicenseImagePreview(pharmacy.license_image);
        setPharmacyImagePreview(pharmacy.image);

        // Populate pharmacy fields, ensuring they are set at the correct path
        Object.keys(pharmacy).forEach((key) => {
          if (key !== "image" && key !== "license_image") {
            setValue(`${key}` as any, pharmacy[key]);
          }
        });
      } catch {
        showSnackbar("Something went wrong, Please Try again", "error");
      }
    };
    fetchData();
  }, [setValue, showSnackbar, user]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    const formDataToSend = new FormData();
    // Append the rest of the pharmacy data, excluding the image field
    Object.keys(data).forEach((key) => {
      if (key !== "image" && key !== "license_image") {
        formDataToSend.append(
          `${key}`,
          data[key as keyof typeof data] as string
        );
      }
    });
    const [pharmacyImageUrl, licenseImageUrl] = await Promise.all([
      data.image
        ? uploadToCloudinary(data.image, "pharmacies_images")
        : Promise.resolve(null),
      data.license_image
        ? uploadToCloudinary(data.license_image, "pharmacies_licenses")
        : Promise.resolve(null),
    ]);
    if (pharmacyImageUrl)
      formDataToSend.append(
        "image",
        pharmacyImageUrl ?? pharmacyImagePreview ?? ""
      );
    if (licenseImageUrl)
      formDataToSend.append(
        "license_image",
        licenseImageUrl ?? licenseImagePreview ?? ""
      );
    formDataToSend.append("is_verified", "false");
    console.log("FormData contents:");
    [...formDataToSend.entries()].forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    try {
      if (pharmacy) await editPharmacy(pharmacy?.id, formDataToSend);
      showSnackbar("Your Detail Updated successfully", "success");
    } catch {
      showSnackbar("Error updating details, Please try again", "error");
    } finally {
      setLoading(false);
    }
  };
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-800 dark:text-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        General Settings
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="space-y-6"
      >
        {/* License Number */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            License Number
          </label>
          <input
            type="text"
            {...register("license_number")}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.license_number && (
            <p className="text-red-500 text-sm mt-1">
              {errors.license_number.message}
            </p>
          )}
        </div>

        {/* License Image */}
        <div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              License Image
            </label>
            <input
              id="license-image"
              type="file"
              accept="image/*"
              name="license_image"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue("license_image", file, {
                    shouldValidate: true,
                  });
                }
              }}
              className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-white dark:hover:file:bg-gray-600"
            />
            {errors.license_image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.license_image.message}
              </p>
            )}
          </div>
          {licenseImagePreview && (
            <div className="my-2">
              <img
                src={licenseImagePreview}
                alt="Current License"
                className="h-28 rounded-md border dark:border-gray-700"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current License Image
              </p>
            </div>
          )}
        </div>
        {/* Pharmacy Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Pharmacy Name
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Phone
          </label>
          <input
            type="text"
            {...register("phone")}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Operating Hours */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Operating Hours
          </label>
          <input
            type="text"
            {...register("operating_hours")}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.operating_hours && (
            <p className="text-red-500 text-sm mt-1">
              {errors.operating_hours.message}
            </p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Website
          </label>
          <input
            type="url"
            {...register("website")}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.website && (
            <p className="text-red-500 text-sm mt-1">
              {errors.website.message}
            </p>
          )}
        </div>

        {/* Delivery Available */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("delivery_available", {
              setValueAs: (v) => (v ? "true" : "false"),
            })}
            className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500"
          />
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Delivery Available
          </label>
        </div>
        {errors.delivery_available && (
          <p className="text-red-500 text-sm mt-1">
            {errors.delivery_available.message}
          </p>
        )}

        {/* Pharmacy Logo */}
        <div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Pharmacy Logo
            </label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setValue("image", file, {
                  shouldValidate: true,
                });
              }}
              className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-white dark:hover:file:bg-gray-600"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>
          {pharmacyImagePreview && (
            <div className="my-2">
              <img
                src={pharmacyImagePreview}
                alt="Current Pharmacy Logo"
                className="h-28 rounded-md border dark:border-gray-700"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current Pharmacy Logo
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors"
        >
          {loading ? "Updating" : "Update"}
        </button>
      </form>

      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </div>
  );
};

export default PharmacistProfile;
