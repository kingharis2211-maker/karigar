import React, { useState } from 'react';
import { User, Mail, Phone, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileProps {
  onRoleSwitch: (newRole: 'buyer' | 'provider') => void;
}

export default function Profile({ onRoleSwitch }: ProfileProps) {
  const { user, logout, switchRole } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSwitchRole = async () => {
    setLoading(true);
    try {
      const newRole = user?.role === 'buyer' ? 'provider' : 'buyer';
      await switchRole(newRole);
      onRoleSwitch(newRole);
    } catch (error) {
      console.error('Error switching role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {user && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
                  <p className="text-gray-600 capitalize">
                    {user.role === 'buyer' ? 'Service Buyer' : 'Service Provider'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-gray-900">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.role === 'provider' && user.rating !== undefined && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600 font-medium">Rating</p>
                    <p className="text-2xl font-bold text-blue-900">{user.rating.toFixed(1)} ⭐</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>

              <div className="space-y-4">
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-4">
                    Currently registered as a <strong>{user.role === 'buyer' ? 'Buyer' : 'Provider'}</strong>. Switch roles to access the other dashboard.
                  </p>
                  <button
                    onClick={handleSwitchRole}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition"
                  >
                    {loading
                      ? 'Switching...'
                      : user.role === 'buyer'
                        ? 'Switch to Provider'
                        : 'Switch to Buyer'}
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
