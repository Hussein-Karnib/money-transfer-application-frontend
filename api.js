import axios from "axios";

// ⚠️ Put your machine's LAN IP here (not localhost), for example:
// const BASE_URL = "http://192.168.1.5:8000/api";
const BASE_URL = "http://YOUR_PC_IP:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Helper to attach token later
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
