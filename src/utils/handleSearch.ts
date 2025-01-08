import { pharmacies } from "../data/pharmacies";
export const Search = (searchCriteria: {
    drugName: string|null;
    pharmacyName: string|null;
  }) => {

    const { drugName, pharmacyName } = searchCriteria;

    if (!drugName?.trim() && !pharmacyName?.trim()) {
     
      return [];
    }
    const results = pharmacies.filter((pharmacy) => {
      const pharmacyNameMatch = pharmacyName
        ? pharmacy.pharmacy_name
            .toLowerCase()
            .includes(pharmacyName.toLowerCase())
        : true;
      const drugNameMatch = drugName
        ? pharmacy.available_drugs.some((drug) =>
            drug.name.toLowerCase().includes(drugName.toLowerCase())
          )
        : true;
      return pharmacyNameMatch && drugNameMatch;
    });

      return results;
  };