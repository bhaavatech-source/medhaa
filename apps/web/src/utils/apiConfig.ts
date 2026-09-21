const PRODUCTION_API_URL = 'https://medhaa-tni1.onrender.com/api';
const configuredApiUrl = import.meta.env.VITE_API_URL as string | undefined;

export const API_URL =
  import.meta.env.PROD && configuredApiUrl?.includes('localhost')
    ? PRODUCTION_API_URL
    : configuredApiUrl || PRODUCTION_API_URL;
