import {ReactNode} from 'react';
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignUpData {
  phone_number: string;
  password: string;
  email: string;
  first_name: string;
  last_name:string
}

export interface OnSearchProps {
  onSearch: (searchCriteria: {
    drugName: string;
    pharmacyName: string;
  }) => void;
}

interface Drug {
  drug_id: number;
  name: string;
  category: string;
}

interface Pharmacy {
  pharmacy_id: number;
  pharmacy_name: string;
  latitude: number;
  longitude: number;
  address: string;
  available_drugs: Drug[];
  image: string;
}

export interface PharmacyDetailProps {
  pharmacies: Pharmacy[];
  calculateDistance: (
    latitude: number,
    longitude: number,
    userLatitude: number,
    userLongitude: number
  ) => string;
}
export interface PharmacyListProps {
  pharmacies: Pharmacy[];
  calculateDistance: (
    latitude: number,
    longitude: number,
    userLatitude: number,
    userLongitude: number
  ) => string;
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
  image: File | null,
  status:string,
}
export interface pharmacyType{
  id: number;
  name: string;
  address: string;
  phone: string;
  operating_hours: string;
  latitude: string;
  longitude: string;
  website: string;
  email: string;
  delivery_available: boolean;
  status: string;
  image:File | null,
}
export interface AddPharmacyModalProps {
  openForm: boolean;
  handleCloseForm: () => void;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => void;
  handleSubmit: () => void;
  formData: pharmacyFormData;
  isEdit: boolean;
}

export interface DelatePharmacyProps{
  isOpen: boolean;
  handleDelete: () => void;
  onClose:()=> void;

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
  phone_number: string | null;
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


export interface medicationType{
    id: number;
    name: string;
    price: string;
    description: string;
    category_name: string;
    dosage_form: string;
    dosage_strength: string;
    manufacturer: string;
    expiry_date: string;
    prescription_required: boolean;
    side_effects: string;
    usage_instructions: string;
    quantity_available: string;
  image: File | null;
  stock_status: boolean;
}
export interface pharmacistType{
  id: number;
  user: CustomUser;
  pharmacy: pharmacyType;
  license_number: string;
  license_image:File | null



}
export type CategoryType = {
  id: number;
  name: string;
  description: string;
};