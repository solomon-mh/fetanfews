/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import axios from "axios";
import "./PharmacyDetails.scss";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { getPharmacyDetail } from "../../api/pharmacyService";
import PharmacyMap from "../../components/MapView/MapView";
import { FaSearch, FaHeartbeat, FaRedo } from "react-icons/fa";
import { searchPharmacyMedications } from "../../api/medicationService";
import { string } from "zod";

// Breadcrumbs Component
// const Breadcrumbs: React.FC = () => {
//   const { pharmacyName } = useParams();

//   const navigate = useNavigate();
//   return (
//     <nav className="breadcrumbs">
//       <span onClick={() => navigate("/")}>Home</span> &gt;{" "}
//       <span onClick={() => navigate("/pharmacies")}>Pharmacies</span> &gt;{" "}
//       <span>{pharmacyName}</span>
//     </nav>
//   );
// };

interface PharmacyDetailPageProps {
  calculateDistance: (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => number;
}

const PharmacyDetailPage: React.FC<PharmacyDetailPageProps> = ({
  calculateDistance,
}) => {
  const [searchParams] = useSearchParams();
  const pharmacyId = searchParams.get("id");
  const [pharmacy, setPharmacy] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isOnsearch, setIsOnsearch] = useState(false);
  const [message, setMessage] = useState("");
  const { pharmacyName } = useParams();
  const [triggerSearch, setTriggerSearch] = useState(false);

  const userLocation = useGeoLocation();
  const userCoordinates: [number, number] =
    userLocation.latitude && userLocation.longitude
      ? [userLocation.latitude, userLocation.longitude]
      : defaultCoordinates;
  // Fetch pharmacy data from API
  useEffect(() => {
    const fetchPharmacyDetails = async () => {
      try {
        if (pharmacyId) {
          const response = await getPharmacyDetail(pharmacyId);
          setPharmacy(response.data);
          setLoading(false);
        } else {
          setError("Pharmacy ID is not defined.");
          setLoading(false);
        }
      } catch (err: any) {
        setError("Failed to fetch pharmacy details.");
        setLoading(false);
      }
    };

    fetchPharmacyDetails();
  }, [pharmacyId]);

  // Function to handle medication search
  const handleSearch = async (term = "") => {
    if (term) {
      setSearchTerm(term);
      setTriggerSearch(true);
    } else if (!searchTerm.trim()) {
      setError("Please enter a search term");
      setSearchResults([]);
      return;
    } else {
      setTriggerSearch(true);
    }
   
  };
  useEffect(() => {
    if (!triggerSearch || !searchTerm.trim()) return;
  
    const searchMedications = async () => {
      setIsOnsearch(true);
      setMessage("");
      setSearchResults([]);
  
      try {
        if (pharmacyId) {
          const result = await searchPharmacyMedications(pharmacyId, searchTerm);
          if (result.message) {
            setMessage(result.message);
          } else if (result.error) {
            setError(result.error);
            setSearchResults([]);
          } else {
            setError("");
            setSearchResults(result);
          }
        } else {
          setError("Pharmacy ID is not defined.");
        }
      } catch (err) {
        setError("An error occurred while searching. Please try again.");
      }
  
      setIsOnsearch(false);
      setTriggerSearch(false); // Reset trigger
    };
  
    searchMedications();
  }, [searchTerm, pharmacyId, triggerSearch]);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setMessage("");
    setSearchTerm(event.target.value);
  };
  const handleRetry = () => {
    setSearchTerm("");
    setIsOnsearch(false);
    setMessage("");
    setError("");
  };

  if (loading) {
    return <p>Loading pharmacy details...</p>;
  }

  if (!pharmacy) {
    return <p>Pharmacy not found.</p>;
  }

  return (
    <div className="pharmacy-detail-wrapper">
      {/* <Breadcrumbs /> */}

      <div className="pharmacy-detail">
        <div className="pharmacy-info-wrapper">
          <img
            src={`http://127.0.0.1:8000${pharmacy.image}`}
            alt={pharmacy.name}
            className="pharmacy-image"
          />
          <div>
            <span className="pharmacy-name">{pharmacy.name} </span>
            {""}
            <span className="pharmacy-distance">
              {calculateDistance(
                pharmacy.latitude,
                pharmacy.longitude,
                userCoordinates[0],
                userCoordinates[1]
              ).toFixed(2)}{" "}
              Km away from you
            </span>
          </div>

          <div className="pharmacy-info">
            <div className="basic-address">
              <p className="pharmacy-phone">Phone: {pharmacy.phone}</p>
              <p className="pharmacy-email">Email: {pharmacy.email}</p>
              <p className="pharmacy-address">{pharmacy.address}</p>
            </div>
            <div className="basic-info">
              {pharmacy.website && (
                <p className="pharmacy-website">
                  Website:{" "}
                  <a
                    href={pharmacy.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pharmacy.website}
                  </a>
                </p>
              )}
              <p className="pharmacy-operating-hours">
                Operating Hours: {pharmacy.operating_hours}
              </p>

              <p className="pharmacy-delivery">
                Delivery Available: {pharmacy.delivery_available ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        {/* Medication Search */}
        <div className="medication-search">
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search by medications name or category"
              className="search-input"
            />
            <button onClick={() => handleSearch("")} className="search-button">
              <FaSearch />
            </button>
          </div>

          {!searchTerm.trim() && !isOnsearch && (
            <div className="search-placeholder">
              <p>
                <span role="img" aria-label="pill">
                  💊
                </span>{" "}
                Enter a medication name or its category to search durgs at{" "}
                <strong>{pharmacyName}</strong>
              </p>
              <p className="suggestions">
                Or check out popular medications:
                <ul>
                  <li
                    onClick={() => {
                      handleSearch("Paracetamol");
                    }}
                  >
                    Paracetamol
                  </li>
                  <li
                    onClick={() => {
                      handleSearch("Ibuprofen");
                    }}
                  >
                    Ibuprofen
                  </li>
                  <li
                    onClick={() => {
                      handleSearch("Amoxicillin");
                    }}
                  >
                    Amoxicillin
                  </li>
                  <li
                    onClick={() => {
                      handleSearch("Aspirin");
                    }}
                  >
                    Aspirin
                  </li>
                </ul>
              </p>
            </div>
          )}

          {isOnsearch ? (
            <div className="search-loading">
              <p>Searching...</p>
              <div className="loading-spinner">
                <FaHeartbeat className="spinner-icon" />
                <span>Hold on, we’re looking for medications...</span>
              </div>
            </div>
          ) : searchTerm && searchResults.length > 0 ? (
            <div className="search-results">
              <h3>Search Results</h3>
              <table className="medication-table">
                <thead>
                  <tr>
                    <th>Drug Name</th>
                    <th>Price</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((med) => (
                    <tr key={med.id}>
                      <td>{med.name}</td>
                      <td>{med.price} Birr</td>
                      <td>
                        <Link
                          to={`/medication/${med.id}`}
                          className="detail-button"
                        >
                          See Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            (message || error) && (
              <div className="no-results">
                <p>{message || error}</p>
                <button onClick={handleRetry} className="retry-button">
                  <FaRedo /> Retry Search
                </button>
              </div>
            )
          )}
        </div>
      </div>
      <div className="pharmacy-map-view">
        <h2 className="section-title">Find <span style={{color:"blue",textDecoration:"underline"}}>{pharmacyName}</span>  on  Map</h2>
        {userLocation.latitude && userLocation.longitude ? (
          <PharmacyMap
            userCoordinates={userCoordinates}
            pharmacies={[pharmacy]}
            userLocationError={userLocation.error}
          />
        ) : (
          <p>Please enable location services to view on map.</p>
        )}
      </div>
    </div>
  );
};

export default PharmacyDetailPage;
