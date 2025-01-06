export const calculateDistance = (latitude: number, longitude: number): string => {
    const userLatitude = 0;
    const userLongitude = 0;
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(latitude - userLatitude);
    const dLon = toRad(longitude - userLongitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userLatitude)) *
        Math.cos(toRad(latitude)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return `${(R * c).toFixed(2)} km`;
  };