/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { privateApi, publicApi } from "./auth";
import axios from "axios";

export const addPharmacy = async (data: any) => {
  console.log(data);

  return privateApi.post("/pharmacies/", data);
};
export const fetchPharmacyData = async () => {
  const response = await publicApi.get("/pharmacies/");
  return response.data;
};
export const editPharmacy = (id: number, data: any) => {
  return privateApi.put(`/pharmacies/${id}/`, data);
};
export const deletePharmacy = (id: number) => {
  return privateApi.delete(`/pharmacies/${id}/`);
};
export const getPharmacyDetail = async (Id: any) => {
  try {
    const response = await publicApi.get(`/pharmacies/${Id}/`);
    return response;
  } catch (error) {
    throw new Error("Failed to fetch pharmacy details");
  }
};
export const addMedicationData = (data: any) => {
  return privateApi.post("/medications/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const fetchMedicationsData = async () => {
  try {
    const response = await publicApi.get("/medications/");
    return response.data;
  } catch (error: any) {
    // Check if response exists (handle server errors)
    if (error.response) {
      throw new Error(
        error.response.data.detail || "Failed to fetch medications."
      );
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const editMedication = async (id: number, data: any) => {
  return privateApi.put(`/medications/${id}/`, data, {
    headers: {
      "Content-Type": "appplication/json",
    },
  });
};
export const deleteMedication = (id: number) => {
  return privateApi.delete(`/medications/${id}/`);
};

// Fetch categories
export const fetchCategoriesData = async () => {
  const response = await publicApi.get("/categories/");
  return response.data;
};
export const browse_by_categories = async () => {
  const response = await publicApi.get("/pharmacies/browse_by_categories/");
  return response.data;
};

// Add a new category
export const addCategroyData = async (data: any) => {
  try {
    const response = await privateApi.post("/categories/", data);
    return response.data; // Return the created category data
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Delete a category
export const deleteCategroy = async (id: number) => {
  try {
    const response = await privateApi.delete(`/categories/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Edit a category
export const editCategroy = async (id: number, data: any) => {
  try {
    const response = await privateApi.put(`/categories/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const fetchPharmacistsData = async () => {
  const response = await publicApi.get("/pharmacists/");
  return response.data;
};
export const addPharmacistData = async (data: any) => {
  const response = await privateApi.post("/pharmacists/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deletePharmacist = async (id: number) => {
  const response = await privateApi.delete(`/pharmacists/${id}/`);
  return response.data;
};

export const editPharmacist = async (id: number, data: any) => {
  const response = await privateApi.put(`/pharmacists/${id}/`, data);
  return response.data;
};
export const searchMedications = async (query: string) => {
  try {
    const response = await publicApi.get(`/medications/search/`, {
      params: { medication: query },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error searching medications:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error searching medications:", error);
    }
    throw error;
  }
};
export const searchPharmacies = async (query = "") => {
  try {
    const response = await publicApi.get(`/pharmacies/search`, {
      params: { pharmacy: query },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching pharmacies:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching pharmacies:", error);
    }
    throw error;
  }
};

export const searchByCategory = async (
  categoryId: number,
  pharmacyId = null
) => {
  try {
    const url = pharmacyId
      ? `/search_by_category/${categoryId}/${pharmacyId}/`
      : `/search_by_category/${categoryId}/`;

    const response = await publicApi.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getNearbyPharmacies = async (
  latitude: number,
  longitude: number,
  lower_limit: number,
  upper_limit: number
) => {
  try {
    const response = await publicApi.get(`/pharmacies/nearby/`, {
      params: { latitude, longitude, lower_limit, upper_limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby pharmacies:", error);
    return [];
  }
};

export const getPharmacyInfo = async (userId: number) => {
  try {
    const response = await publicApi.get(
      `/pharmacies/get-pharmacy-info/?user_id=${userId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching pharmacist details:", error);
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "An error occurred while fetching data.";

    throw errorMessage;
  }
};

// Function to update pharmacist details
export const updatePharmacistDetails = async (updatedData: any) => {
  try {
    const response = await publicApi.put(
      "/pharmacist/get_or_update/",
      updatedData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "An error occurred while updating data.";

    throw errorMessage;
  }
};

//repors

export const getPharmacyStatusReport = async () => {
  try {
    const response = await privateApi.get("/pharmacies/status-report/");
    return response.data;
  } catch (error) {
    console.error("Error fetching pharmacy status report:", error);
    throw error;
  }
};
export const fetchPharmaciesWithoutPharmacists = async () => {
  try {
    const response = await publicApi.get("/pharmacies-without-pharmacists/");
    return response.data;
  } catch (error) {
    console.error("Error fetching pharmacies without pharmacists:", error);
    throw error;
  }
};
export const getPharmacistsPharmacy = async (userId: number) => {
  const response = await privateApi.get(`/pharmacies/by-user/${userId}`);
  return response.data;
};
