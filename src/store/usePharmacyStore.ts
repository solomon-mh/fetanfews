import { create } from "zustand";

interface Medication {
  id: number;
  name: string;
  price: string;
  pharmacies: [];
}
interface PharmacyStore {
  medications: Medication[];
  setMedications: (meds: Medication[]) => void;
  clearMedications: () => void;
}

export const usePharmacyStore = create<PharmacyStore>((set) => ({
  medications: [],
  setMedications: (meds) => set({ medications: meds }),
  clearMedications: () => set({ medications: [] }),
}));
