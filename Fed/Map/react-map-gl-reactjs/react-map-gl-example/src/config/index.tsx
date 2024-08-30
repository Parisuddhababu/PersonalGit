export const MAP_BOX_API_TOKEN = process.env.REACT_APP_MAPBOX_API_TOKEN || '';

export const intitalMapValue = {
  latitude: 21.7679,
  longitude: 78.8718,
  zoom: 3.5,
};

export const MAP_STYLE = 'mapbox://styles/mapbox/streets-v9';

export const MapHeightWidth = {
  width: 'auto',
  height: '100vh',
};

export const random = (min: number, max: number): number => {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const randomBytes = new Uint8Array(bytesNeeded);
  window.crypto.getRandomValues(randomBytes);
  const value = randomBytes.reduce((acc, byte) => (acc << 8) | byte, 0);
  return min + (value % range);
};
