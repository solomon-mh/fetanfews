import { useState } from "react";

const LocationPrompt = () => {
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude!,
          longitude: position.coords.longitude!,
        });
        setError("");
      },
      () => {
        setError(
          "Location access denied. Please allow location from your browser settings."
        );
      }
    );
  };

  if (!userLocation.latitude || !userLocation.longitude) {
    return (
      <div className="min-h-screen max-w-5xl flex items-center justify-center px-4">
        <div className="text-center bg-red-50 dark:bg-transparent border border-red-300 dark:border-red-700 px-6 py-6 rounded-md shadow max-w-5xl">
          <p className="text-red-600 dark:text-red-300 font-medium mb-4">
            Please allow location access to continue.
          </p>
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 mb-4">
              {error}
            </p>
          )}
          <button
            onClick={requestLocation}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
          >
            Allow Location
          </button>
        </div>
      </div>
    );
  }
};

export default LocationPrompt;
