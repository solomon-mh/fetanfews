/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const API_BASE_URL = "http://localhost:8000/api";
export const searchPharmacyMedications = async (pharmacyId: string, query: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pharmacies/${pharmacyId}/medications/search/`, {
        params: { query },
      });
      return response.data; 
    } catch (error:any) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        return { error: error.response.data.error || error.response.data.message };
      } else if (error.request) {
        console.error("Error request:", error.request);
        return { error: "No response from server. Please try again later." };
      } else {
        console.error("Error message:", error.message);
        return { error: error.message };
      }
    }
};
export const getPharmacyMedicationDetail = async (pharmacyId: string, medicationId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pharmacies/${pharmacyId}/medications/${medicationId}/`);
    return { data: response.data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data?.error || "An error occurred while fetching medication details.",
    };
  }
};