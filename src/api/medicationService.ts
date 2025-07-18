/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { privateApi, publicApi } from "./auth";
const API_BASE_URL = "http://localhost:8000/api";
export const searchPharmacyMedications = async (
  pharmacyId: string,
  query: string
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/pharmacies/${pharmacyId}/medications/search/`,
      {
        params: { medication: query },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      return {
        error: error.response.data.error || error.response.data.message,
      };
    } else if (error.request) {
      console.error("Error request:", error.request);
      return { error: "No response from server. Please try again later." };
    } else {
      console.error("Error message:", error.message);
      return { error: error.message };
    }
  }
};
export const getPharmacyMedicationDetail = async (
  pharmacyId: string,
  medicationId: string
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/pharmacies/${pharmacyId}/medications/${medicationId}/`
    );
    return { data: response.data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error:
        error.response?.data?.error ||
        "An error occurred while fetching medication details.",
    };
  }
};

export const fetchMedicationCounts = async () => {
  try {
    const response = await privateApi.get("/medications/counts");
    return response.data;
  } catch (error) {
    console.error("Error fetching medication counts:", error);
    throw error;
  }
};
export const fetchPharmacyMedicationCounts = async (id: number) => {
  try {
    const response = await privateApi.get(`/${id}/medications/counts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching medication counts:", error);
    throw error;
  }
};

export const fetchMostSearchedMedications = async () => {
  try {
    const response = await publicApi.get(
      `/pharmacies/most-searched-medications/`,
      {
        params: {
          global: 1,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching most searched medications:", error);
    return [];
  }
};

export const addMostSearchedMedications = async (data: any) => {
  try {
    const response = await publicApi.post(
      "/pharmacies/most-searched-medications/",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching most searched medications:", error);
    throw error;
  }
};

export const getPhaMostSearchedMedications = async (pharmacist_id: number) => {
  try {
    const response = await privateApi.get(
      `/pharmacies/most-searched-medications/?pharmacist_id=${pharmacist_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching most searched medications:", error);
    throw error;
  }
};
