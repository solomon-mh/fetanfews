/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { searchPharmacies, searchMedications } from "../api/pharmacyService";

export const Search = async (searchCriteria: {
  drugName: string | null;
  pharmacyName: string | null;
}) => {
  const { drugName, pharmacyName } = searchCriteria;

  if (!drugName?.trim() && !pharmacyName?.trim()) {
    return [];
  }

  try {
    let pharmacyResults = [];
    let medicationResults = [];

    // If pharmacy name is provided, search pharmacies
    if (pharmacyName) {
      pharmacyResults = await searchPharmacies(pharmacyName);
    }

    // If drug name is provided, search medications
    if (drugName) {
      medicationResults = await searchMedications(drugName);
    }

    // If only medication search criteria is provided, filter pharmacies based on drugs
    if (drugName && !pharmacyName) {
     

      return medicationResults.length>0? medicationResults.map(
        (medication: any) => medication.pharmacy_details
      ):[];
    }

    // If both search criteria are provided (pharmacy and drug), filter pharmacies
    if (drugName && pharmacyName) {
      return pharmacyResults.filter((pharmacy: any) =>
        medicationResults.some(
          (medication: any) =>
            medication.pharmacy_details &&
            medication.pharmacy_details.name
              .toLowerCase()
              .includes(pharmacyName.toLowerCase())
        )
      );
    }

    // If only pharmacy search criteria is provided, return pharmacies matching the pharmacy name
    return pharmacyResults;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};
