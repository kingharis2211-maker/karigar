import React from 'react';
import { Home, Briefcase, User, LogOut, List } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export default function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-blue-600">SkillLink</h1>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  currentScreen === 'dashboard'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </button>

              {user.role === 'buyer' && (
                <>
                  <button
                    onClick={() => onNavigate('browse')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      currentScreen === 'browse'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    Browse
                  </button>
                  <button
                    onClick={() => onNavigate('services')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      currentScreen === 'services'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    Services
                  </button>
                </>
              )}

              {user.role === 'provider' && (
                <>
                  <button
                    onClick={() => onNavigate('services')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      currentScreen === 'services'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    My Services
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{user.full_name}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="capitalize">{user.role}</span>
              </span>
            </div>

            <button
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                currentScreen === 'profile'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>

        <div className="md:hidden mt-4 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition whitespace-nowrap text-sm ${
              currentScreen === 'dashboard'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>

          {user.role === 'buyer' && (
            <button
              onClick={() => onNavigate('browse')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition whitespace-nowrap text-sm ${
                currentScreen === 'browse'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
              Browse
            </button>
          )}

          <button
            onClick={() => onNavigate('services')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition whitespace-nowrap text-sm ${
              currentScreen === 'services'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            {user.role === 'buyer' ? 'Services' : 'My Services'}
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition whitespace-nowrap text-sm ${
              currentScreen === 'profile'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
}
