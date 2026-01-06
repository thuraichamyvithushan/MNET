// Configuration for API endpoints
// In Vercel (or other production environments), set REACT_APP_API_URL in your environment variables.
// Locally, it defaults to http://localhost:3001

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default API_BASE_URL;
