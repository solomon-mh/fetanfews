/* eslint-disable @typescript-eslint/no-explicit-any */
import React,{useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pharmacyFormSchema } from "../../utils/validateForm";
import "./PharmacyForm.scss";
import { FaPhone } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { addPharmacy } from "../../api/pharmacyService";
import { useNavigate } from "react-router-dom";

interface PharmacyFormValues {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  operating_hours: string;
  image?: FileList;
  delivery_available: string;
}

const PharmacyForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PharmacyFormValues>({
    resolver: zodResolver(pharmacyFormSchema),
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: PharmacyFormValues) => {
    setErrorMessage(null)
    const formData = new FormData();
    console.log(formData);

    Object.keys(data).forEach((key) => {

      if (key === "image") {
        if (data.image?.[0]) formData.append(key, data.image[0]);
      } else {
        formData.append(key, (data as any)[key]);
      }
    });
 
  
    try {

      const response = await addPharmacy(formData);
      console.log("Response:", response.data);
      navigate("/pharmacy-registration/success");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || JSON.stringify(error.response?.data, null, 2) || "An error occurred. Please try again.";
      setErrorMessage(`Failed to register pharmacy: ${errorMessage}`);
      console.error("Error:", errorMessage);

    }
  };
  

  return (
    <div className="container-wrapper">
      <div className="how-to-register">
        <h3>How to Register</h3>
        <ol>
          <li>Fill out all the required fields in the form.</li>
          <li>
            Attach an image of your pharmacy (optional). This image will display
            our site as your logo
          </li>
          <li>
            {" "}
            Provide a precise address, including Kebele, known building, and
            exact location within Bahir Dar city. Avoid general addresses like
            "Bahir Dar, Ethiopia" as the system supports only Bahir Dar city
            currently.
          </li>
          <li>Click "Submit" to complete registration.</li>
        </ol>
        <h4>Benefits of Registering</h4>
        <ul>
          <li>
            Gain visibility on our platform, reaching a broader customer base.
          </li>
          <li>
            Enable delivery services for your customers, increasing convenience
            and sales.
          </li>
          <li>
            Provide accurate operating details to your customers, ensuring trust
            and reliability.
          </li>
          <li>
            Make your pharmacy easily discoverable through location-based drug
            search functionality.
          </li>
          <li>
            Allow customers to check real-time availability of medications at
            your pharmacy.
          </li>
        </ul>
      </div>
      <div className="pharmacy-form-container">
        <h2>Register Pharmacy</h2>
        {errorMessage && <p className="error-message">{errorMessage }</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="pharmacy-form">
          <div className="form-group">
            <div>
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                placeholder="name of pharmcacy"
                {...register("name")}
              />
            </div>
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>
          <div className="form-group">
            <div>
              <label htmlFor="address">Address:</label>
              <input
                id="address"
                placeholder="address of pharmacy"
                type="text"
                {...register("address")}
              />
            </div>
            {errors.address && (
              <p className="error">{errors.address.message}</p>
            )}
          </div>
          <div className="form-group">
            <div>
              <label htmlFor="phone">Phone:</label>
              <input
                id="phone"
                placeholder="contact number"
                type="text"
                {...register("phone")}
              />
            </div>
            {errors.phone && <p className="error">{errors.phone.message}</p>}
          </div>
          <div className="form-group">
            <div>
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                placeholder="contact email"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div className="form-group">
            <div>
              <label htmlFor="website">Website (Optional):</label>
              <input
                id="website"
                placeholder="enter url if any"
                type="url"
                {...register("website")}
              />
            </div>
            {errors.website && (
              <p className="error">{errors.website.message}</p>
            )}
          </div>
          <div className="form-group">
            <div>
              <label htmlFor="operating_hours">Operating Hours:</label>
              <input
                id="operating_hours"
                type="text"
                placeholder="e.g., Mon-Fri: 9 AM - 8 PM, Sat-Sun: 10 AM - 6 PM,24/7"
                {...register("operating_hours")}
              />
            </div>
            {errors.operating_hours && (
              <p className="error">{errors.operating_hours.message}</p>
            )}
          </div>
          <div className="form-group">
            <div>
              <label htmlFor="image">Image (Optional):</label>
              <input id="image" type="file" {...register("image")} />
            </div>
          </div>
          <div className="form-group">
            <div className="yes-no-group">
              <label>Delivery Available:</label>

              <label htmlFor="delivery_yes">
                <input
                  id="delivery_yes"
                  type="radio"
                  value="true"
                  {...register("delivery_available")}
                />
                Yes
              </label>
              <label htmlFor="delivery_no">
                <input
                  id="delivery_no"
                  type="radio"
                  value="false"
                  {...register("delivery_available")}
                />
                No
              </label>
            </div>
            {errors.delivery_available && (
              <p className="error">{errors.delivery_available.message}</p>
            )}
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="need-help">
        <h3>Other Benefits</h3>
        <ul>
          <li>
            Build customer loyalty by offering a user-friendly experience
            through online searches and purchases.
          </li>
          <li>
            Receive analytics on customer searches to stock high-demand
            medications effectively.
          </li>
          <li>
            Reduce unnecessary inquiries by providing comprehensive information
            about your offerings online.
          </li>
          <li>
            Boost sales by attracting nearby customers actively looking for
            specific medications.
          </li>
          <li>
            Participate in platform promotions and highlight your services, such
            as free delivery or discounts.
          </li>
          <li>
            Strengthen your presence in the community by being part of an
            innovative healthcare network.
          </li>
        </ul>
        <h3>Need Help?</h3>
        <p>
          If you have any questions, feel free to contact our support team at
        </p>
        <p>
          <FaPhone className="icon" /> 0970345323
        </p>
        <p>
          <MdMarkEmailRead className="icon" /> support@gmail.com
        </p>
      </div>
    </div>
  );
};

export default PharmacyForm;
