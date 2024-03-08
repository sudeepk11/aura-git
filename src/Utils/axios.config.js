import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3001",
  // baseURL: "http://3.110.70.229:3001",
  // baseURL: "https://aura-git-frontend.onrender.com",
  baseURL: "https://aura-git.onrender.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(function (config) {
  let token = localStorage.getItem("access_token");
  config.headers["Authorization"] = "Bearer " + token;
  return config;
});

export default api;
