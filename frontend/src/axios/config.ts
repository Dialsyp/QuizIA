import axios from "axios"

const axiosInstanceSecure = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_PORT}`,
  withCredentials: true, // ⭐ IMPORTANT pour les cookies de session
})

export default axiosInstanceSecure