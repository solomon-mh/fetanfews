

export interface OnSearchProps {
    onSearch: (searchCriteria: { drugName: string; pharmacyName: string }) => void;
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
  calculateDistance: (latitude: number, longitude: number) => string;
}
export interface PharmacyListProps {
  pharmacies: Pharmacy[];
  calculateDistance: (latitude: number, longitude: number) => string;
  onShowAll?: () => void;
  showAllButton?: boolean;
}