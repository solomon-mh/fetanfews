/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pharmacyFormSchema } from "../../utils/validateForm";
import "./PharmacyForm.scss";

interface PharmacyFormValues {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  operating_hours: string;
  image?: FileList;
  delivery_available: boolean;
  latitude: number;
  longitude: number;
}

const PharmacyForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PharmacyFormValues>({
    resolver: zodResolver(pharmacyFormSchema),
  });

  const onSubmit = (data: PharmacyFormValues) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "image") {
        if (data.image?.[0]) formData.append(key, data.image[0]);
      } else {
        formData.append(key, (data as any)[key]);
      }
    });

    console.log("Form submitted:", formData);
    // You can send formData to your API here
  };

  return (
    <div className="pharmacy-form-container">
      <h2>Register Pharmacy</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="pharmacy-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" {...register("name")} />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" {...register("address")} />
          {errors.address && <p className="error">{errors.address.message}</p>}
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" {...register("phone")} />
          {errors.phone && <p className="error">{errors.phone.message}</p>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register("email")} />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        <div className="form-group">
          <label>Website (Optional)</label>
          <input type="url" {...register("website")} />
          {errors.website && <p className="error">{errors.website.message}</p>}
        </div>
        <div className="form-group">
          <label>Operating Hours</label>
          <input type="text" {...register("operating_hours")} />
          {errors.operating_hours && (
            <p className="error">{errors.operating_hours.message}</p>
          )}
        </div>
        <div className="form-group">
          <label>Image (Optional)</label>
          <input type="file" {...register("image")} />
        </div>
        <div className="form-group">
          <label>Delivery Available</label>
          <input type="checkbox" {...register("delivery_available")} />
          {errors.delivery_available && (
            <p className="error">{errors.delivery_available.message}</p>
          )}
        </div>
        <div className="form-group">
          <label>Latitude</label>
          <input type="number" step="any" {...register("latitude")} />
          {errors.latitude && (
            <p className="error">{errors.latitude.message}</p>
          )}
        </div>
        <div className="form-group">
          <label>Longitude</label>
          <input type="number" step="any" {...register("longitude")} />
          {errors.longitude && (
            <p className="error">{errors.longitude.message}</p>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PharmacyForm;
