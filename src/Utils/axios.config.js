import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3001",
  // baseURL: "http://3.110.70.229:3001",
  baseURL: "https://aura-git-frontend.onrender.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export default api;
