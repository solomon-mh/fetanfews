import React, { createContext, useContext, useState, useEffect } from "react";
import { privateApi } from "../api/auth";

interface PharmacyContextType {
  numberOfPharmacies: number;
  pendingPharmacies: number;
  rejectedPharmacies: number;
  approvedPharmacies: number;
  loading: boolean;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(
  undefined
);

interface PharmacyContextProviderProps {
  children: React.ReactNode;
}

export const PharmacyContextProvider: React.FC<
  PharmacyContextProviderProps
> = ({ children }) => {
  const [numberOfPharmacies, setNumberOfPharmacies] = useState<number>(0);
  const [pendingPharmacies, setPendingPharmacies] = useState<number>(0);
  const [rejectedPharmacies, setRejectedPharmacies] = useState<number>(0);
  const [approvedPharmacies, setApprovedPharmacies] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const getData = async () => {
    try {
      const response = await privateApi.get("/pharmacies/counts");
      const data = response.data;

      setNumberOfPharmacies(data.total);
      setPendingPharmacies(data.pending);
      setRejectedPharmacies(data.rejected);
      setApprovedPharmacies(data.approved);
    } catch (error) {
      console.error("Error fetching pharmacy counts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <PharmacyContext.Provider
      value={{
        numberOfPharmacies,
        pendingPharmacies,
        rejectedPharmacies,
        approvedPharmacies,
        loading,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacyData = (): PharmacyContextType => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error(
      "usePharmacyData must be used within a PharmacyContextProvider"
    );
  }
  return context;
};
