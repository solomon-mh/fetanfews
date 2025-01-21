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
  
  
