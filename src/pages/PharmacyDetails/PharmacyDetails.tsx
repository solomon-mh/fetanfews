/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useEffect, useState } from "react";
import { useParams, useNavigate ,useSearchParams} from "react-router-dom";
import axios from "axios";
import "./PharmacyDetails.scss";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { getPharmacyDetail } from "../../api/pharmacyService";
// Breadcrumbs Component
const Breadcrumbs: React.FC = () => {
  const { pharmacyName } = useParams(); 

  const navigate = useNavigate();
  return (
    <nav className="breadcrumbs">
      <span onClick={() => navigate("/")}>Home</span> &gt;{" "}
      <span onClick={() => navigate("/pharmacies")}>Pharmacies</span> &gt;{" "}
      <span>{pharmacyName}</span>
    </nav>
  );
};

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
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term
  const [searchResults, setSearchResults] = useState<any[]>([]); // State for search results
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
  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await axios.get(
          `/api/medications/search/?query=${searchTerm}`
        );
        setSearchResults(response.data);
      } catch (err) {
        setError("Failed to fetch medications.");
      }
    } else {
      setSearchResults([]);
    }
  };

  if (loading) {
    return <p>Loading pharmacy details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!pharmacy) {
    return <p>Pharmacy not found.</p>;
  }

  return (
    <div className="pharmacy-detail-wrapper">
      <Breadcrumbs />

      <div className="pharmacy-detail">
        <div className="pharmacy-info-wrapper">
          <img
            src={`http://127.0.0.1:8000${pharmacy.image}`}
            alt={pharmacy.name}
            className="pharmacy-image"
          />
          <h1 className="pharmacy-name">{pharmacy.name}</h1>
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
              <p className="pharmacy-distance">
                Distance:{" "}
                {calculateDistance(
                  pharmacy.latitude,
                  pharmacy.longitude,
                  userCoordinates[0],
                  userCoordinates[1]
                ).toFixed(2)}{" "}
                Km
              </p>
            </div>
          </div>
        </div>

        {/* Medication Search */}
        <div className="medication-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for medications..."
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>

          {/* Display Search Results */}
          {searchResults.length > 0 ? (
            <div className="search-results">
              <h3>Search Results</h3>
              <ul>
                {searchResults.map((med) => (
                  <li key={med.id} className="search-result-item">
                    <strong>{med.name}</strong> - {med.price} -{" "}
                    {med.stock_status}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No medications found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetailPage;
