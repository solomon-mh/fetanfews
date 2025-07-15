import { create } from "zustand";
import { IMedication, medicationType } from "../utils/interfaces";
import { createJSONStorage, persist } from "zustand/middleware";

interface PharmacyStore {
  medications: IMedication[];
  pharmacyMed: medicationType[];
  setPharmacyMed: (meds: medicationType[]) => void;
  setMedications: (meds: IMedication[]) => void;
  clearMedications: () => void;
}

export const usePharmacyStore = create<PharmacyStore>()(
  persist(
    (set) => ({
      medications: [],
      pharmacyMed: [],
      setMedications: (meds: IMedication[]) =>
        set((state) => ({ ...state, medications: meds })),
      setPharmacyMed: (meds: medicationType[]) =>
        set((state) => ({ ...state, pharmacyMed: meds })),
      clearMedications: () => set((state) => ({ ...state, medications: [] })),
    }),
    {
      name: "pharmacy-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
