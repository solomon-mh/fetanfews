export const calculateDistance = (
  latitude: number,
  longitude: number,
  userLatitude: number,
  userLongitude: number
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(latitude - userLatitude);
  const dLon = toRad(longitude - userLongitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(userLatitude)) *
      Math.cos(toRad(latitude)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};
