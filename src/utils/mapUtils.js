/**
 * Map Utilities
 * Helper functions for map operations, coordinate conversions, and calculations
 */

/**
 * Calculate bearing between two coordinates
 * Useful for showing direction of ambulance movement
 */
export const calculateBearing = (lat1, lng1, lat2, lng2) => {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const bearing = Math.atan2(y, x);

  return (((bearing * 180) / Math.PI + 360) % 360).toFixed(2);
};

/**
 * Format coordinates to readable string
 */
export const formatCoordinates = (lat, lng, decimals = 4) => {
  const direction = (value) => (value >= 0 ? 'N' : 'S');
  const latDir = direction(lat);
  const lngDir = direction(lng);

  return `${Math.abs(lat).toFixed(decimals)}°${latDir}, ${Math.abs(lng).toFixed(decimals)}°${lngDir}`;
};

/**
 * Check if point is within bounds
 */
export const isPointInBounds = (point, bounds) => {
  return (
    point.lat >= bounds.south &&
    point.lat <= bounds.north &&
    point.lng >= bounds.west &&
    point.lng <= bounds.east
  );
};

/**
 * Fit map bounds to multiple points
 */
export const calculateBounds = (points) => {
  if (points.length === 0) return null;

  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLng = points[0].lng;
  let maxLng = points[0].lng;

  points.forEach(({ lat, lng }) => {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });

  return {
    north: maxLat,
    south: minLat,
    east: maxLng,
    west: minLng,
  };
};

/**
 * Calculate zoom level based on bounds
 */
export const calculateZoomLevel = (bounds, mapWidth, mapHeight) => {
  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 28;

  const latRad = (bounds.north * Math.PI) / 180;
  const metersPerPixel = (40075017.688844 * Math.cos(latRad)) / Math.pow(2, ZOOM_MAX + 1);

  const latDelta = bounds.north - bounds.south;
  const lngDelta = bounds.east - bounds.west;

  let zoom = ZOOM_MAX;

  for (let z = 0; z < ZOOM_MAX; z++) {
    const mpp = (40075017.688844 * Math.cos(latRad)) / Math.pow(2, z + 1);
    const latZoom = (latDelta * 40075017.688844) / (360 * mpp);
    const lngZoom = (lngDelta * 40075017.688844) / (360 * mpp);

    if (latZoom < mapHeight && lngZoom < mapWidth) {
      zoom = z;
      break;
    }
  }

  return Math.max(0, zoom - 1);
};

/**
 * Simplify polyline coordinates using Douglas-Peucker algorithm
 * Reduces number of points while maintaining shape
 */
export const simplifyPolyline = (points, tolerance = 0.00001) => {
  if (points.length < 3) return points;

  let maxDist = 0;
  let maxIndex = 0;

  // Find point with maximum distance from line
  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (dist > maxDist) {
      maxDist = dist;
      maxIndex = i;
    }
  }

  // If max distance is greater than tolerance, recursively simplify
  if (maxDist > tolerance) {
    const left = simplifyPolyline(points.slice(0, maxIndex + 1), tolerance);
    const right = simplifyPolyline(points.slice(maxIndex), tolerance);
    return left.slice(0, -1).concat(right);
  } else {
    return [points[0], points[points.length - 1]];
  }
};

/**
 * Calculate perpendicular distance from point to line
 */
function perpendicularDistance(point, lineStart, lineEnd) {
  const dx = lineEnd.lng - lineStart.lng;
  const dy = lineEnd.lat - lineStart.lat;
  const mag = Math.sqrt(dx * dx + dy * dy);

  if (mag === 0) {
    return Math.sqrt(
      (point.lng - lineStart.lng) ** 2 + (point.lat - lineStart.lat) ** 2
    );
  }

  const pvx = (point.lng - lineStart.lng) / mag;
  const pvy = (point.lat - lineStart.lat) / mag;
  const pvdot = pvx * dx + pvy * dy;
  const closest = [lineStart.lng + (pvdot * dx) / mag, lineStart.lat + (pvdot * dy) / mag];

  return Math.sqrt(
    (closest[0] - point.lng) ** 2 + (closest[1] - point.lat) ** 2
  );
}

/**
 * Generate random point within radius of center
 * Useful for simulating vehicle locations
 */
export const getRandomPointInRadius = (center, radiusKm) => {
  const radiusRad = radiusKm / 6371; // Convert km to radians
  const u = Math.random();
  const v = Math.random();
  const w = radiusRad * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  const lng = center.lng + (x * 180) / Math.PI / Math.cos((center.lat * Math.PI) / 180);
  const lat = center.lat + (y * 180) / Math.PI;

  return { lat, lng };
};

/**
 * Format time difference
 */
export const formatTimeDifference = (seconds) => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

/**
 * Format distance
 */
export const formatDistance = (kilometers) => {
  if (kilometers < 1) return `${Math.round(kilometers * 1000)}m`;
  return `${kilometers.toFixed(1)}km`;
};

/**
 * Create a circle polygon from center and radius
 */
export const createCirclePoints = (center, radiusKm, steps = 32) => {
  const points = [];
  const radiusRad = radiusKm / 6371;

  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const lat = Math.asin(
      Math.sin((center.lat * Math.PI) / 180) * Math.cos(radiusRad) +
        Math.cos((center.lat * Math.PI) / 180) * Math.sin(radiusRad) * Math.cos(angle)
    );
    const lng =
      ((center.lng * Math.PI) / 180 +
        Math.atan2(
          Math.sin(angle) * Math.sin(radiusRad) * Math.cos((center.lat * Math.PI) / 180),
          Math.cos(radiusRad) - Math.sin((center.lat * Math.PI) / 180) * Math.sin(lat)
        )) *
      (180 / Math.PI);

    points.push({
      lat: lat * (180 / Math.PI),
      lng: lng,
    });
  }

  return points;
};

/**
 * Interpolate between two points
 */
export const interpolateCoordinates = (start, end, fraction) => {
  return {
    lat: start.lat + (end.lat - start.lat) * fraction,
    lng: start.lng + (end.lng - start.lng) * fraction,
  };
};

/**
 * Validate coordinates
 */
export const isValidCoordinate = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

/**
 * Get tile server URLs for different map styles
 */
export const TileServers = {
  // Standard OSM
  osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

  // Dark theme
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',

  // Light theme
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',

  // Satellite
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',

  // Terrain
  terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
};

/**
 * Attribution strings for different tile servers
 */
export const TileAttributions = {
  osm: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  dark: '&copy; <a href="https://carto.com/">Carto</a>',
  light: '&copy; <a href="https://carto.com/">Carto</a>',
  satellite: '&copy; <a href="https://www.esri.com">Esri</a>',
  terrain: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
};
