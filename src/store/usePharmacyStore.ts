import { create } from "zustand";
import { IMedication, medicationType } from "../utils/interfaces";

// export interface IMedication {
//   id: number;
//   name: string;
//   price: number;
//   pharmacies: [];
// }
interface PharmacyStore {
  medications: IMedication[];
  pharmacyMed: medicationType[];
  setPharmacyMed: (meds: medicationType[]) => void;
  setMedications: (meds: IMedication[]) => void;
  clearMedications: () => void;
}

export const usePharmacyStore = create<PharmacyStore>((set) => ({
  medications: [],
  pharmacyMed: [],
  setMedications: (meds) => set({ medications: meds }),
  setPharmacyMed: (meds) => set({ pharmacyMed: meds }),
  clearMedications: () => set({ medications: [] }),
}));
