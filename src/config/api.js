// src/config/api.js

export const API =
  (import.meta.env.VITE_API_URL || "").trim() || "http://localhost:5000";
