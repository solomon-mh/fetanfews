import { create } from "zustand";
import { medicationType } from "../utils/interfaces";

interface Medication {
  id: number;
  name: string;
  price: string;
  pharmacies: [];
}
interface PharmacyStore {
  medications: Medication[];
  pharmacyMed: medicationType[];
  setPharmacyMed: (meds: medicationType[]) => void;
  setMedications: (meds: Medication[]) => void;
  clearMedications: () => void;
}

export const usePharmacyStore = create<PharmacyStore>((set) => ({
  medications: [],
  pharmacyMed: [],
  setMedications: (meds) => set({ medications: meds }),
  setPharmacyMed: (meds) => set({ pharmacyMed: meds }),
  clearMedications: () => set({ medications: [] }),
}));
