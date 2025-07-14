import { ReactNode } from "react";
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignUpData {
  phone: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface OnSearchProps {
  onSearch: (searchCriteria: {
    drugName: string;
    pharmacyName: string;
  }) => void;
}

// interface Drug {
//   drug_id: number;
//   name: string;
//   category: string;
// }

export interface IMedication {
  id: number;
  name: string;
  price: number;
  pharmacies: PharmacyDataType[];
  pivot: MedPharPivot;
}
export interface PharmacyDataType {
  id: number;
  user_id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string; // Optional
  image: string;
  is_verified: boolean;
  delivery_available: boolean;
  latitude: number;
  longitude: number;
  operating_hours: string;
  status: "Approved" | "Pending" | "Rejected"; // Restrict possible values
  pivot: MedPharPivot;
  price: number;
}

export interface PharmacyDetailProps {
  pharmacies: PharmacyDataType[];
  calculateDistance: (
    latitude: number,
    longitude: number,
    userLatitude: number,
    userLongitude: number
  ) => string;
}
export interface PharmacyListProps {
  pharmacies: PharmacyDataType[];
  calculateDistance: (
    latitude: number,
    longitude: number,
    userLatitude: number,
    userLongitude: number
  ) => number;
  onShowAll?: () => void;
  showAllButton?: boolean;
}
export interface pharmacyFormData {
  name: string;
  address: string;
  phone: string;
  operating_hours: string;
  latitude: string;
  longitude: string;
  website: string;
  email: string;
  delivery_available: boolean;
  image: "";
  status: string;
}
export interface MedPharPivot {
  manufacturer: string;
  price: string;
  quantity_available: string;
  stock_status: boolean;
}
export interface pharmacyType {
  id: number;
  name: string;
  address: string;
  phone: string;
  operating_hours: string;
  latitude: number;
  longitude: number;
  website: string;
  email: string;
  delivery_available: boolean;
  status: string;
  image: File | string | null;
  price?: number;
  medications: medicationType[];
  pivot: MedPharPivot;
}
export interface AddPharmacyModalProps {
  openForm: boolean;
  handleCloseForm: () => void;
  handleInputChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => void;
  handleSubmit: () => void;
  formData: pharmacyFormData;
  isEdit: boolean;
}

export interface DelatePharmacyProps {
  isOpen: boolean;
  handleDelete: () => void;
  onClose: () => void;
}

export interface FormErrors {
  [key: string]: {
    message?: string;
  };
}
export enum UserRole {
  ADMIN = "admin",
  PHARMACIST = "pharmacist",
  USER = "user",
}
export interface CustomUser {
  id: number;
  email: string | null;
  phone: string | null;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
}

export interface ChildrenProps {
  children: ReactNode;
}
export interface medicationType {
  id: number;
  name: string;
  description: string;
  category: { name: string };
  dosage_form: string;
  dosage_strength: string;
  expiry_date: string;
  prescription_required: boolean;
  side_effects: string;
  usage_instructions: string;
  image: string;
  price: number;
  pharmacies: PharmacyDataType[];
  pivot: MedPharPivot;
}

export interface pharmacistType {
  id: number;
  user: CustomUser;
  pharmacy: pharmacyType;
  license_number: string;
  license_image: File | null;
}
export type CategoryType = {
  id: number;
  name: string;
  description: string;
};
