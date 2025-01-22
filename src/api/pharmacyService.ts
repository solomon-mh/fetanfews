/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./auth";


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

export const fetchCategoriesData = () => {
  return api.get("/categories/");
}
export const addCategroyData = (data:any) => {
  return api.post('/categories/', data);
}
export const deleteCategroy = () => { 
  return api.delete('/categories/');
}

export const editCategroy = (id:number,data: any) => { 
  return api.put(`/categories/${id}/`, data);
}
