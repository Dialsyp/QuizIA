import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getCurrentUser } from '../axios/auth'

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      const userData = await getCurrentUser()
      if (userData) {
        setUser(userData)
      } else {
        navigate('/')
      }
    }
    checkUser()
  }, [navigate])

  const handleLogout = () => {
    setUser(null)
    window.location.href = `http://localhost:${import.meta.env.VITE_PORT}/logout/google`
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Header user={user.email} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Mon Profil</h1>
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full" />
              ) : (
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-700">{user.name || user.email}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quiz complétés:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Score moyen:</span>
                  <span className="font-semibold">0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temps total:</span>
                  <span className="font-semibold">0 min</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50 transition-colors">
                  Notifications
                </button>
                <button className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50 transition-colors">
                  Préférences
                </button>
                <button className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50 transition-colors">
                  Historique
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage