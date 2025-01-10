import { useState, useEffect } from "react";

interface GeoLocation {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export const useGeoLocation = (): GeoLocation => {
  const [location, setLocation] = useState<GeoLocation>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude, error: null });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = "";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Permission denied. Please enable location services.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location unavailable. Please try again.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out.";
          break;
        default:
          errorMessage = "An unknown error occurred.";
      }
      setLocation((prev) => ({ ...prev, error: errorMessage }));
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return location;
};
export const defaultCoordinates: [number, number] = [11.5742, 37.3614]; // Bahir Dar

