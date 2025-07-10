import { z } from "zod";

// Zod schema for the form

const nameValidation = z
  .string()
  .min(1, { message: "Name is required." })
  .max(50, { message: "Name must not exceed 50 characters." })
  .regex(/^[A-Za-z\s]+$/, { message: "Name must contain only letters." });

const emailValidation = z.string().email({ message: "Invalid email address." });

const phoneValidation = z
  .string()
  .max(13, { message: "Phone number must not exceed 13 characters." })
  .regex(/^(?:\+2519\d{8}|\+2517\d{8}|09\d{8}|07\d{8})$/, {
    message: "Phone number must be in a valid Ethiopian format.",
  });

const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[!@#$%^&*]/, {
    message: "Password must contain at least one special character.",
  });

const requiredString = (field: string) =>
  z.string().min(1, { message: `${field} is required.` });
const optionalUrl = z.string().url("Invalid URL.").optional().or(z.literal(""));

const acceptedImageTypes = ["image/jpeg", "image/png", "application/pdf"];

export const requiredFileSchema = z
  .instanceof(File)
  .refine(
    (file) => acceptedImageTypes.includes(file.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  );

export const optionalFileSchema = requiredFileSchema.optional().nullable();

export const formSchema = z
  .object({
    first_name: nameValidation,
    last_name: nameValidation,
    email: emailValidation,
    phone: phoneValidation,
    password: passwordValidation,
    confirmPassword: z
      .string()
      .min(1, { message: "Password confirmation is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"], // Attach the error to the confirmPassword field
  });

export const pharmacyFormSchema = z.object({
  name: requiredString("Name is required"),
  address: requiredString("Address"),
  phone: phoneValidation,

  email: emailValidation,
  website: optionalUrl,
  operating_hours: requiredString("Operating hours"),
  image: optionalFileSchema,
  delivery_available: z.string(),
  license_number: requiredString("License number"),
  license_image: requiredFileSchema,
});

export const medicationSchema = z.object({
  name: requiredString("Name "),
  price: z.number().min(0, "Price must be a positive number"),
  description: z.string().optional(),
  category: z.number().refine((val) => val !== null && val !== undefined, {
    message: "Category is required",
  }),
  dosage_form: requiredString("Dosage form"),
  dosage_strength: requiredString("Dosage strength"),
  manufacturer: requiredString("Manufacturer"),
  expiry_date: requiredString("Expiry date"),
  side_effects: z.string().optional(),
  stock_status: z.boolean().optional(),
  usage_instructions: z.string().optional(),
  quantity_available: z.number().min(1, "Quantity must be at least 1"),
  image: z.any().optional(),
  prescription_required: z.boolean(),
});

export const pharmacySchema = z.object({
  name: requiredString("Name"),
  address: requiredString("Address "),
  phone: phoneValidation,
  email: emailValidation,
  website: optionalUrl,
  operating_hours: requiredString("Operating hours"),
  delivery_available: z.string(),
  latitude: requiredString("Latitude "),
  longitude: requiredString("Longitude "),
});

export const pharmasistDetailSchema = z.object({
  license_number: requiredString("License Number"),
  license_image: z.instanceof(File).optional().nullable(),

  pharmacy: z.object({
    name: requiredString("Pharmacy Name "),
    phone: phoneValidation,
    email: emailValidation,
    operating_hours: requiredString("Operating Hours "),
    website: optionalUrl,
    delivery_available: z.string(),
    image: z.instanceof(File).optional().nullable(),
  }),
});
