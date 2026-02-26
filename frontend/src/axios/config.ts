import axios from "axios"

const axiosInstanceSecure = axios.create({
  baseURL: `${import.meta.env.URL_BACKEND}`,
  withCredentials: true, // ⭐ IMPORTANT pour les cookies de session
})

export default axiosInstanceSecure