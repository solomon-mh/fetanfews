import React, { useState } from "react";
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
  const { user } = useAuth();
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
  watch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: PharmacyFormValues) => {
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
      setErrorMessage(`Failed to register pharmacy: ${errorMessage}`);
      console.error("Error:", error);
    }
  };

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
            Submit
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default PharmacyForm;
