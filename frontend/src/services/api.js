import axios from "axios";

const API = axios.create({
  baseURL: "https://genai-hackathon-nayanas-team.onrender.com/api", // backend URL
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
