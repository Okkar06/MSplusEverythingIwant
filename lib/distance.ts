const EARTH_RADIUS_M = 6_371_000;

type Point = { latitude: number; longitude: number };

/** Great-circle distance between two points, in metres. */
export function distanceMeters(a: Point, b: Point): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Splits a distance into the number and its unit for display.
 * Under 1 km: whole metres. Under 10 km: one decimal. Otherwise whole km.
 */
export function formatDistance(meters: number): { value: string; unit: string } {
  if (meters < 1000) {
    return { value: String(Math.round(meters)), unit: "m" };
  }
  const km = meters / 1000;
  if (km < 10) {
    return { value: km.toFixed(1), unit: "km" };
  }
  return { value: Math.round(km).toLocaleString("en"), unit: "km" };
}
