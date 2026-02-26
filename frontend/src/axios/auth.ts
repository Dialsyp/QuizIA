import type { User } from "../types/user.type"
import axiosInstanceSecure from "./config"


export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = axiosInstanceSecure.get(`/api/CurrentUser`)
    const data = (await response).data
    return data.user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}