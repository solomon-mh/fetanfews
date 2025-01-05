import defualtImage from '../assets/images/default.jpeg';
import doctorphaImage from '../assets/images/doctorpharma.jpg';
import etsephaImage from '../assets/images/etsepharma.jpeg';
import gelilaphaImage from '../assets/images/gelilapharma.jpg';
import kidanemihiretphaImage from '../assets/images/kidanemihiretpharma.jpg';
import greenphaImage from '../assets/images/greenpharma.jpeg';
import tenaphaImage from '../assets/images/tenapharma.jpeg';
import tsegewuphaImage from '../assets/images/tsgewupharma.jpeg';
import gizawaphaImage from '../assets/images/gizewapharma.jpeg';


// Interface for Drug
interface Drug {
    drug_id: number;
    name: string;
    category: string;
  }
  
  // Interface for Pharmacy
  interface Pharmacy {
    pharmacy_id: number;
    pharmacy_name: string;
    latitude: number;
    longitude: number;
    address: string;
    available_drugs: Drug[];
    image: string;
  }
  export const pharmacies: Pharmacy[] = [
    {
          pharmacy_id: 1,
        image:tsegewuphaImage,
      pharmacy_name: "Tsegaw Pharmacy",
      latitude: 11.59364,
      longitude: 37.39077,
      address: "Kebele 12, Bahir Dar, Ethiopia",
      available_drugs: [
        { drug_id: 101, name: "Paracetamol", category: "Pain Relief" },
        { drug_id: 102, name: "Ibuprofen", category: "Pain Relief" },
        { drug_id: 103, name: "Amoxicillin", category: "Antibiotic" }
      ]
    },
    {
        pharmacy_id: 2,
        image:greenphaImage,
      pharmacy_name: "Green pharmacy",
      latitude: 12.60746,
      longitude: 37.45204,
      address: "Main Road, Gondar, Ethiopia",
      available_drugs: [
        { drug_id: 104, name: "Ciprofloxacin", category: "Antibiotic" },
        { drug_id: 105, name: "Metformin", category: "Diabetes" },
        { drug_id: 106, name: "Atorvastatin", category: "Cholesterol" }
      ]
    },
    {
        pharmacy_id: 3,
        image:etsephaImage,
      pharmacy_name: "Etse Pharmacy",
      latitude: 9.0054,
      longitude: 38.7636,
      address: "Piazza, Addis Ababa, Ethiopia",
      available_drugs: [
        { drug_id: 107, name: "Amlodipine", category: "Hypertension" },
        { drug_id: 108, name: "Losartan", category: "Hypertension" },
        { drug_id: 109, name: "Salbutamol", category: "Respiratory" }
      ]
    },
    {
        pharmacy_id: 4,
        image:gizawaphaImage,
      pharmacy_name: "Gizewa Pharmacy",
      latitude: 7.0622,
      longitude: 38.4763,
      address: "Market Area, Hawassa, Ethiopia",
      available_drugs: [
        { drug_id: 110, name: "Omeprazole", category: "Acid Reflux" },
        { drug_id: 111, name: "Lansoprazole", category: "Acid Reflux" },
        { drug_id: 112, name: "Cetirizine", category: "Allergy" }
      ]
    },
    {
        pharmacy_id: 5,
        image:gelilaphaImage,
      pharmacy_name: "Gelila Pharmacy",
      latitude: 13.4979,
      longitude: 39.4691,
      address: "Downtown, Mekelle, Ethiopia",
      available_drugs: [
        { drug_id: 113, name: "Furosemide", category: "Diuretic" },
        { drug_id: 114, name: "Spironolactone", category: "Diuretic" },
        { drug_id: 115, name: "Prednisolone", category: "Steroid" }
      ]
    },
    {
        pharmacy_id: 6,
        image:doctorphaImage,
      pharmacy_name: "Doctor pharmacy",
      latitude: 9.588,
      longitude: 41.8619,
      address: "Station Road, Dire Dawa, Ethiopia",
      available_drugs: [
        { drug_id: 116, name: "Hydrochlorothiazide", category: "Diuretic" },
        { drug_id: 117, name: "Azithromycin", category: "Antibiotic" },
        { drug_id: 118, name: "Vitamin D", category: "Supplement" }
      ]
    },
    {
        pharmacy_id: 7,
        image:tenaphaImage,
      pharmacy_name: "Tena Pharmacy",
      latitude: 7.67344,
      longitude: 36.83509,
      address: "University Road, Jimma, Ethiopia",
      available_drugs: [
        { drug_id: 119, name: "Warfarin", category: "Blood Thinner" },
        { drug_id: 120, name: "Insulin", category: "Diabetes" },
        { drug_id: 121, name: "Levothyroxine", category: "Thyroid" }
      ]
    },
    {
        pharmacy_id: 8,
        image:defualtImage,
      pharmacy_name: "Enat AsFaW Pharmacy",
      latitude: 8.5469,
      longitude: 39.2682,
      address: "Bole Road, Adama, Ethiopia",
      available_drugs: [
        { drug_id: 122, name: "Fluconazole", category: "Antifungal" },
        { drug_id: 123, name: "Clotrimazole", category: "Antifungal" },
        { drug_id: 124, name: "Aspirin", category: "Blood Thinner" }
      ]
    },
    {
        pharmacy_id: 9,
        image:kidanemihiretphaImage,
      pharmacy_name: "Kidane Mihret Clinic",
      latitude: 7.2047,
      longitude: 38.5998,
      address: "Central Avenue, Shashemene, Ethiopia",
      available_drugs: [
        { drug_id: 125, name: "Captopril", category: "Hypertension" },
        { drug_id: 126, name: "Carvedilol", category: "Heart Failure" },
        { drug_id: 127, name: "Montelukast", category: "Respiratory" }
      ]
    },
    {
        pharmacy_id: 10,
        image:defualtImage,
      pharmacy_name: "Red Cross Pharmacy",
      latitude: 9.3075,
      longitude: 42.1226,
      address: "Old Town, Harar, Ethiopia",
      available_drugs: [
        { drug_id: 128, name: "Ranitidine", category: "Acid Reflux" },
        { drug_id: 129, name: "Loratadine", category: "Allergy" },
        { drug_id: 130, name: "Doxycycline", category: "Antibiotic" }
      ]
    }
  ];
  
  