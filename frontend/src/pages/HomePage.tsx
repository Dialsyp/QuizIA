import { useEffect } from "react"
import LandingPage from "../components/LandingPage"
import { useAuthStore } from "../zustand/auth.store"

const HomePage = () => {

  const user = useAuthStore((state) => state.user)
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      window.location.href = "/dashboard"
    }
  }, [user])

  const handleLogin = () => {
    window.location.href =
      `${import.meta.env.URL_BACKEND}/auth/google`
  }

  return <LandingPage onLogin={handleLogin} />
}

export default HomePage