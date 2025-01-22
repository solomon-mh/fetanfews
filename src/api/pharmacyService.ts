/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./auth";
// import axios from "axios";

export const addPharmacy = (data: any) => {
  console.log('api data',data);
    return api.post("/pharmacies/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  
export const addMedicationData=(data: any) => {
  return api.post('/medications/', data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export const fetchMedicationsData = () => {
  return api.get("/medications/");
}

export const fetchPharmaciesData = () => {
  return api.get("/pharmacies/");
}
// Fetch categories
export const fetchCategoriesData = async () => {

    const response = await api.get("/categories/");
    return response.data; // Return the categories directly
 
};

// Add a new category
export const addCategroyData = async (data: any) => {

    const response = await api.post("/categories/", data);
    return response.data; // Return the created category data

};

// Delete a category
export const deleteCategroy = async (id: number) => {
 
    const response = await api.delete(`/categories/${id}/`);
    return response.data; // Return the response for optional feedback
 
};

// Edit a category
export const editCategroy = async (id: number, data: any) => {
    const response = await api.put(`/categories/${id}/`, data);
    return response.data; 
 
};

// const handleApiError = (error: any, defaultMessage: string) => {
//   if (axios.isAxiosError(error)) {
//     const message = error.response?.data?.message || error.message || defaultMessage;
//     console.error(message); 
//     alert(message); 
//   } else {
//     console.error(defaultMessage);
//     alert(defaultMessage);
//   }
// };