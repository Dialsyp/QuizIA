import type { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  user: string
  onLogout: () => void
}

const Header: FC<HeaderProps> = ({ user, onLogout }) => {
  const location = useLocation()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
            QuizIA
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/dashboard"
              className={`font-medium transition-colors ${
                location.pathname === '/dashboard' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Tableau de bord
            </Link>
            {/* <Link
              to="/profile"
              className={`font-medium transition-colors ${
                location.pathname === '/profile' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Profil
            </Link> */}
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden sm:block">Bienvenue, {user}</span>
            <button
              onClick={onLogout}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header