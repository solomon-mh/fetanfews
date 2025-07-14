import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { PharmacyDataType } from "../../utils/interfaces";
import { calculateDistance } from "../../utils/calculations";
import { redIcon } from "./icons";

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

const PharmacyMap: React.FC<PharmacyMapProps> = ({
  userCoordinates,
  pharmacies,
  userLocationError,
}) => {
  return (
    <div className="pharmacy-map p-4">
      {userLocationError ? (
        <p className="error-message">{userLocationError}</p>
      ) : isValidCoordinate(userCoordinates) ? (
        <MapContainer
          center={userCoordinates}
          zoom={13}
          style={{ height: "500px", width: "100%", padding: "8px" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker position={userCoordinates} icon={redIcon}>
            <Popup>Your Location</Popup>
          </Marker>
          {pharmacies.map((pharmacy) => {
            const lat = Number(pharmacy.latitude);
            const lng = Number(pharmacy.longitude);
            const isValid = !isNaN(lat) && !isNaN(lng);

            return isValid ? (
              <Marker key={pharmacy.id} position={[lat, lng]}>
                <Popup>
                  <strong>{pharmacy.name}</strong>
                  <br />
                  Distance:{" "}
                  {calculateDistance(
                    lat,
                    lng,
                    userCoordinates[0],
                    userCoordinates[1]
                  ).toFixed(2)}{" "}
                  km
                </Popup>
              </Marker>
            ) : null;
          })}
        </MapContainer>
      ) : (
        <p className="text-red-500">User location is invalid or unavailable.</p>
      )}
    </div>
  );
};

export default PharmacyMap;
