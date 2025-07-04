import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { PharmacyDataType } from "../../utils/interfaces";
import { calculateDistance } from "../../utils/calculations";

interface PharmacyMapProps {
  userCoordinates: [number, number];
  pharmacies: PharmacyDataType[];
  userLocationError?: string | null;
}

const isValidCoordinate = (coord: unknown): coord is [number, number] =>
  Array.isArray(coord) &&
  typeof coord[0] === "number" &&
  typeof coord[1] === "number" &&
  !isNaN(coord[0]) &&
  !isNaN(coord[1]);

const isValidLatLng = (lat: unknown, lng: unknown): boolean =>
  typeof lat === "number" &&
  typeof lng === "number" &&
  !isNaN(lat) &&
  !isNaN(lng);

const PharmacyMap: React.FC<PharmacyMapProps> = ({
  userCoordinates,
  pharmacies,
  userLocationError,
}) => {
  return (
    <div className="pharmacy-map">
      {userLocationError ? (
        <p className="error-message">{userLocationError}</p>
      ) : isValidCoordinate(userCoordinates) ? (
        <MapContainer
          center={userCoordinates}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker position={userCoordinates}>
            <Popup>Your Location</Popup>
          </Marker>

          {pharmacies.map((pharmacy) =>
            isValidLatLng(pharmacy.latitude, pharmacy.longitude) ? (
              <Marker
                key={pharmacy.id}
                position={[pharmacy.latitude, pharmacy.longitude]}
              >
                <Popup>
                  {pharmacy.name}
                  <br />
                  Distance:{" "}
                  {calculateDistance(
                    pharmacy.latitude,
                    pharmacy.longitude,
                    userCoordinates[0],
                    userCoordinates[1]
                  ).toFixed(2)}{" "}
                  Km
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      ) : (
        <p className="text-red-500">User location is invalid or unavailable.</p>
      )}
    </div>
  );
};

export default PharmacyMap;
