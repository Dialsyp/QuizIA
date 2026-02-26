import { useEffect } from "react"
import LandingPage from "../components/LandingPage"
import { useAuthStore } from "../zustand/auth.store"

const HomePage = () => {

  const user = useAuthStore((state) => state.user)
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (user) {
      window.location.href = "/dashboard"
    }
  }, [user])

  const handleLogin = () => {
    window.location.replace(`${import.meta.env.VITE_URL_BACKEND}/auth/google`)
  }

  return <LandingPage onLogin={handleLogin} />
}

export default HomePage