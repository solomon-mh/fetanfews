/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import {
  getPharmacistDetails,
  updatePharmacistDetails,
} from "../../api/pharmacyService";
import SnackbarComponent from "../modals/SnackbarComponent";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pharmasistDetailSchema } from "../../utils/validateForm";

const PharmacistProfile = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");

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
  } = useForm({
    resolver: zodResolver(pharmasistDetailSchema),
    defaultValues: {
      license_number: "",
      license_image: null,
      pharmacy: {
        name: "",
        phone: "",
        email: "",
        operating_hours: "",
        website: "",
        delivery_available: false,
        image: null,
      },
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPharmacistDetails();
        setCurrentEmail(data.pharmacy.email);

        // Populate form fields at top level
        setValue("license_number", data.license_number);

        // Populate pharmacy fields, ensuring they are set at the correct path
        Object.keys(data.pharmacy).forEach((key) => {
          if (key !== "image") {
            setValue(`pharmacy.${key}`, data.pharmacy[key]);
          }
        });
      } catch (error: any) {
        showSnackbar(error.message || "Something went wrong", "error");
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (e.target.name === "image") {
        setValue("pharmacy.image" as any, file);
      } else {
        setValue(e.target.name as any, file); // Directly update react-hook-form's state
      }
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    const formDataToSend = new FormData();

    formDataToSend.append("license_number", data.license_number);

    // Ensure the 'license_image' is a file before appending it
    if (data.license_image) {
      formDataToSend.append("license_image", data.license_image);
    }

    // Ensure the 'pharmacy.image' is a file before appending it
    if (data.pharmacy.image) {
      formDataToSend.append("pharmacy.image", data.pharmacy.image);
    }

    // Append the rest of the pharmacy data, excluding the image field
    Object.keys(data.pharmacy).forEach((key) => {
      if (key !== "image") {
        formDataToSend.append(
          `pharmacy.${key}`,
          data.pharmacy[key as keyof typeof data.pharmacy] as string
        );
      }
    });

    if (currentEmail === String(formDataToSend.get("pharmacy.email"))) {
      formDataToSend.delete("pharmacy.email"); // Do not send the email again if it's the same
    }

    try {
      // Ensure no Content-Type header is set manually for file uploads
      await updatePharmacistDetails(formDataToSend);
      showSnackbar("Your Detail Updated successfully", "success");
    } catch (error: any) {
      showSnackbar(error?.message || "Error updating details", "error");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="setting">
      <h2>Genaral Settings</h2>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="pharmasist-setting">
          <div className="form-group">
            <div className="input-lable">
              <label>License Number</label>
              <span> Update the License Number if Your have new one.</span>
            </div>
            <p>
              <input type="text" {...register("license_number")} />
              {errors.license_number && (
                <p className="error">{errors.license_number.message}</p>
              )}
            </p>
          </div>
          <div className="form-group">
            {" "}
            <div className="input-lable">
              <label>License Image</label>
              <span>Update the license image if you have a new one.</span>
            </div>
            <p>
              <input
                type="file"
                accept="image/*"
                name="license_image"
                onChange={handleFileChange}
              />

              {errors.license_image && (
                <p className="error">{errors.license_image.message}</p>
              )}
            </p>
          </div>
          <div className="form-group">
            <div className="input-lable">
              <label>Pharmacy Name</label>
              <span>Edit the name if your pharmacy's name has changed.</span>
            </div>
            <p>
              <input type="text" {...register("pharmacy.name")} />
              {errors.pharmacy && errors.pharmacy.name && (
                <p className="error">{errors.pharmacy.name.message}</p>
              )}
            </p>
          </div>
          <div className="form-group">
            <div className="input-lable">
              <label>Phone</label>
              <span>Provide a valid phone number for pharmacy contact.</span>
            </div>
            <p>
              <input type="text" {...register("pharmacy.phone")} />
              {errors.pharmacy && errors.pharmacy.phone && (
                <p className="error">{errors.pharmacy.phone.message}</p>
              )}
            </p>
          </div>
          <div className="form-group">
            <div className="input-lable">
              <label>Email</label>
              <span>
                Ensure the email is correct, as it will be used for
                communication.
              </span>
            </div>
            <p>
              <input type="email" {...register("pharmacy.email")} />
            </p>
          </div>
          <div className="form-group">
            <div className="input-lable">
              <label>Operating Hours</label>
              <span>
                Update your pharmacy’s working hours (e.g., 24/7, 9 AM - 9 PM).
              </span>
            </div>
            <p>
              <input type="text" {...register("pharmacy.operating_hours")} />

              {errors.pharmacy && errors.pharmacy.operating_hours && (
                <p className="error">
                  {errors.pharmacy.operating_hours.message}
                </p>
              )}
            </p>
          </div>
          <div className="form-group">
            <div className="input-lable">
              <label>Website</label>
              <span>
                Provide the pharmacy's official website, if available.
              </span>
            </div>
            <p>
              <input type="url" {...register("pharmacy.website")} />

              {errors.pharmacy && errors.pharmacy.website && (
                <p className="error">{errors.pharmacy.website.message}</p>
              )}
            </p>
          </div>
          <div className="form-group">
            <div className="input-lable">
              <label>Delivery Available</label>
              <span>Check it ,if your pharmacy offers delivery services.</span>
            </div>
            <p>
              <input
                type="checkbox"
                {...register("pharmacy.delivery_available")}
              />

              {errors.pharmacy && errors.pharmacy.delivery_available && (
                <p className="error">
                  {errors.pharmacy.delivery_available.message}
                </p>
              )}
            </p>
          </div>
          <div className="form-group">
            <div className="input-lable">
              <label>Pharmacy Logo</label>
              <span>Upload a new pharmacy logo if you want to update it.</span>
            </div>
            <p>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFileChange}
              />
              {errors.pharmacy?.image && (
                <p className="error">{errors.pharmacy.image.message}</p>
              )}
            </p>
          </div>
        </div>

        <button className="setting-button" type="submit">
          Update
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
