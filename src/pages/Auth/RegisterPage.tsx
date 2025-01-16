import React, { useState } from "react";
import { userRegister } from "../../api/auth";
import "./Auth.scss";
import drugStore from "../../assets/images/drugstore.jpg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../utils/validateForm";
import { FormErrors } from "../../utils/interfaces";
const SignUp: React.FC = () => {

  const [submissionMessage, setSubmissionMessage] = useState(" ");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key !== "confirmPassword") {
        formData.append(key, data[key]);
      }
    });

    try {
     const response= await userRegister(formData);
     setSubmissionMessage(response.data.message);
    } catch (error) {
      setSubmissionMessage("Error Creating user: "+error );
    }
  };

 

  const renderError = (fieldName: keyof FormErrors) => {
    return errors[fieldName] ? (
      <p className="error">{errors[fieldName]?.message?.toString()}</p>
    ) : null;
  };


  return (
    <div className="auth-page">
      <div className="auth-container ">
        <h2>Register to Book Online!</h2>
        <p>
          LocateMed has a strong protocol that a user should use their own phone
          number and password to login. If you are booking for someone else,
          please use their phone number to register.
        </p>
        {submissionMessage && (
          <p className="error">{submissionMessage}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              placeholder="Enter First Name"
              {...register("first_name")}
            />
            {renderError("first_name")}
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              {...register("last_name")}
              placeholder="Enter Last Name"
            />
            {renderError("last_name")}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter Email Address"
            />
            {renderError("email")}
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              {...register("phone")}
              placeholder="E.g. 0911xxxxxx or 0703xxxxxx"
            />
            {renderError("phone")}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              {...register("password")}
            />
            {renderError("password")}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Enter Password again"
            />
            {renderError("confirmPassword")}
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" required /> I agree to the terms and
              conditions
            </label>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <a href="/user/login">Login</a>
        </p>
      </div>
      <div className="auth-image">
        <img src={drugStore} alt="drugStore image" />
      </div>
    </div>
  );
};

export default SignUp;
