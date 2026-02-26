import axios from "axios"

const axiosInstanceSecure = axios.create({
  baseURL: `${import.meta.env.VITE_URL_BACKEND}`,
  withCredentials: true, // ⭐ IMPORTANT pour les cookies de session
})

export default axiosInstanceSecure