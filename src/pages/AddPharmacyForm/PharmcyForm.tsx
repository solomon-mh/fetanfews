import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pharmacyFormSchema } from "../../utils/validateForm";
import { addPharmacy } from "../../api/pharmacyService";
import { useNavigate } from "react-router-dom";
import { containerVariants, itemVariants } from "../../utils/animateVariant";
import { motion } from "framer-motion";
import { formFields } from "./formFields";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { useAuth } from "../../contexts/AuthContext";
import { useGeoLocation } from "../../hooks/useGeoLocation";
import SnackbarComponent from "../../admin/modals/SnackbarComponent";

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

const PharmacyForm: React.FC = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const [loading, setLoading] = useState(false);
  const userLocation = useGeoLocation();
  const { user } = useAuth();
  console.log(user);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PharmacyFormValues>({
    resolver: zodResolver(pharmacyFormSchema),
    defaultValues: {
      phone: user?.phone ?? "",
      email: user?.email ?? "",
    },
  });
  const [showLocationMessage, setShowLocationMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userLocation.latitude || !userLocation.longitude) {
        setShowLocationMessage(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [userLocation]);
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  watch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: PharmacyFormValues) => {
    setLoading(true);
    try {
      const [pharmacyImageUrl, licenseImageUrl] = await Promise.all([
        data.image
          ? uploadToCloudinary(data.image, "pharmacies_images")
          : Promise.resolve(null),
        data.license_image
          ? uploadToCloudinary(data.license_image, "pharmacies_licenses")
          : Promise.resolve(null),
      ]);

      const payload = {
        ...data,
        image: pharmacyImageUrl,
        license_image: licenseImageUrl,
        is_verified: false,
        delivery_available: data.delivery_available === "true",
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      };

      setErrorMessage(null);

      await addPharmacy(payload);
      navigate("/pharmacy-registration/success");
    } catch (error: unknown) {
      let errorMessage = "An error occurred. Please try again.";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: unknown } }).response ===
          "object" &&
        (error as { response?: { data?: unknown } }).response !== null
      ) {
        const response = (error as { response: { data?: unknown } }).response;
        errorMessage =
          (response.data &&
          typeof response.data === "object" &&
          "detail" in response.data
            ? (response.data as { detail?: string }).detail
            : undefined) || errorMessage;
      }

      setSnackbar({
        open: true,
        type: "error",
        message: errorMessage,
      });

      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  if (
    (!userLocation.latitude || !userLocation.longitude) &&
    showLocationMessage
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center my-6 text-red-600 dark:text-red-300 bg-red-50 dark:bg-transparent border border-red-300 dark:border-red-700 px-4 py-3 rounded-md shadow-sm max-w-md mx-auto">
          Please Allow your Location
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <motion.div
        className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 space-y-6"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={containerVariants}
      >
        <motion.h2
          variants={itemVariants}
          className="text-2xl font-semibold text-center"
        >
          Register Pharmacy
        </motion.h2>

        {errorMessage && (
          <p className="text-red-600 dark:text-red-400 text-center">
            {errorMessage}
          </p>
        )}

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          variants={itemVariants}
          className="space-y-5"
        >
          {formFields.map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium mb-1">
                {label}
              </label>
              <input
                id={id}
                type={type}
                placeholder={placeholder}
                disabled={id === "phone" || id === "email"}
                {...register(id as keyof PharmacyFormValues)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors[id as keyof PharmacyFormValues] && (
                <p className="text-sm text-red-500 mt-1">
                  {errors[id as keyof PharmacyFormValues]?.message as string}
                </p>
              )}
            </div>
          ))}

          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-1">
              Image (Optional)
            </label>
            <input
              id="image"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setValue("image", file, { shouldValidate: true });
              }}
              className="block w-full text-sm text-gray-500 dark:text-gray-300"
            />
          </div>

          <div>
            <p className="block text-sm font-medium mb-2">
              Delivery Available:
            </p>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  id="delivery_yes"
                  type="radio"
                  value="true"
                  {...register("delivery_available")}
                  className="accent-blue-600"
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  id="delivery_no"
                  type="radio"
                  value="false"
                  {...register("delivery_available")}
                  className="accent-blue-600"
                />
                No
              </label>
            </div>
            {errors.delivery_available && (
              <p className="text-sm text-red-500 mt-1">
                {errors.delivery_available.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="license_image"
              className="block text-sm font-medium mb-1"
            >
              License Image (Required) *
            </label>
            <input
              id="license_image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setValue("license_image", file, {
                  shouldValidate: true,
                });
              }}
              className="block w-full text-sm text-gray-500 dark:text-gray-300"
            />
            {errors.license_image && (
              <p className="text-sm text-red-500 mt-1">
                {errors.license_image.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {loading ? " Submitting" : "Submit"}
          </button>
        </motion.form>
      </motion.div>
      <SnackbarComponent
        open={snackbar.open}
        type={snackbar.type}
        onClose={closeSnackbar}
        message={snackbar.message}
      />
    </div>
  );
};

export default PharmacyForm;
