/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./auth";
import axios from "axios";
const API_BASE_URL = "http://localhost:8000/api";

export const addPharmacy = (data: any) => {
  console.log('api data',data);
    return api.post("/pharmacies/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
};
export const fetchPharmacyData = async () => {
    const response = await api.get("/pharmacies/");
    return response.data;
}
export const editPharmacy = (id: number, data: any) => {
  return api.put(`/pharmacies/${id}/`, data);

}
export const deletePharmacy = (id: number) => {
  return api.delete(`/pharmacies/${id}/`)
}
  
export const addMedicationData=(data: any) => {
  return api.post('/medications/', data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export const fetchMedicationsData = async () => {
  const response = await api.get("/medications/");
  return response.data; 

}
export const editMedication = async (id: number, data: any) => { 
  return api.put(`/medications/${id}/`, data,{
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export const deleteMedication = (id: number) => {
  return api.delete(`/medications/${id}/`);
}


// Fetch categories
export const fetchCategoriesData = async () => {
  try {

    const response = await api.get("/categories/");
    return response.data; 
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
 
};

// Add a new category
export const addCategroyData = async (data: any) => {
  try{
  

    const response = await api.post("/categories/", data);
    return response.data; // Return the created category data
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Delete a category
export const deleteCategroy = async (id: number) => {
  try {
   
    const response = await api.delete(`/categories/${id}/`);
    return response.data; 
 }  catch (error) {
  console.error("Error deleting category:", error);
  throw error;
}
};

// Edit a category
export const editCategroy = async (id: number, data: any) => {
  try {
    const response = await api.put(`/categories/${id}/`, data);
    return response.data;
  }
    catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
 
};


export const fetchPharmacistsData = async () => {
  const response = await api.get("/pharmacists/");
  return response.data; 
  
}
export const addPharmacistData = async (data: any)=>{
  const response = await api.post("/pharmacists/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
  );
  return response.data; 
}



export const deletePharmacist = async (id: number) => {
 
  const response = await api.delete(`/pharmacists/${id}/`);
  return response.data; 

};

export const editPharmacist = async (id: number, data: any) => {
  const response = await api.put(`/pharmacists/${id}/`, data);
  return response.data; 

};
export const searchMedications = async (query:string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/medications/search/`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error searching medications:", error.response?.data || error.message);
    } else {
      console.error("Error searching medications:", error);
    }
    throw error;
  }
};
export const searchPharmacies = async (query = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pharmacies/search/`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching pharmacies:", error.response?.data || error.message);
    } else {
      console.error("Error fetching pharmacies:", error);
    }
    throw error;
  }
};