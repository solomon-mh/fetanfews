import { searchMedications, searchPharmacies } from "../api/pharmacyService";
import { PharmacyDataType } from "./interfaces";
import { IMedication } from "./interfaces";

export const Search = async (searchCriteria: {
  drugName: string | null;
  pharmacyName: string | null;
}) => {
  const { drugName, pharmacyName } = searchCriteria;

  if (!drugName?.trim() && !pharmacyName?.trim()) {
    return { type: "none", data: [] };
  }

  try {
    let pharmacyResults = [];
    let medicationResults = [];

    if (pharmacyName) {
      pharmacyResults = await searchPharmacies(pharmacyName);
    }

    if (drugName) {
      medicationResults = await searchMedications(drugName);
    }

    // 🎯 Only medication search
    if (drugName && !pharmacyName) {
      // Extract pharmacies from medications
      const grouped = groupMedsByPharmacy(medicationResults);
      return { type: "medication", data: grouped };
    }

    if (drugName && pharmacyName) {
      const filtered = pharmacyResults
        .map((pharmacy: PharmacyDataType) => {
          const matchesName = pharmacy.name
            .toLowerCase()
            .includes(pharmacyName.toLowerCase());

          if (!matchesName) return null;

          // Filter medications that belong to this pharmacy
          const matchedMeds = medicationResults.filter((med: IMedication) =>
            med.pharmacies?.some((p: PharmacyDataType) => p.id === pharmacy.id)
          );

          if (matchedMeds.length === 0) return null;

          return {
            ...pharmacy,
            medications: matchedMeds,
          };
        })
        .filter(Boolean); // Remove nulls

      return { type: "pharmacy", data: filtered };
    }

    // 🎯 Only pharmacy
    return { type: "pharmacy", data: pharmacyResults };
  } catch (error) {
    console.error("Search error:", error);
    return { type: "error", data: [] };
  }
};

function groupMedsByPharmacy(medications: IMedication[]) {
  const pharmacyMap: Record<
    string,
    PharmacyDataType & { medications: IMedication[] }
  > = {};

  medications.forEach((med) => {
    med.pharmacies?.forEach((pharmacy: PharmacyDataType) => {
      if (!pharmacyMap[pharmacy.id]) {
        pharmacyMap[pharmacy.id] = { ...pharmacy, medications: [] };
      }
      pharmacyMap[pharmacy.id].medications.push(med);
    });
  });

  return Object.values(pharmacyMap); // [{...pharmacy, medications: [...]}, ...]
}
