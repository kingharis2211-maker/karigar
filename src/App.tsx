import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './screens/Login';
import Register from './screens/Register';
import BuyerDashboard from './screens/BuyerDashboard';
import ProviderDashboard from './screens/ProviderDashboard';
import Profile from './screens/Profile';
import Navigation from './components/Navigation';

function AppContent() {
  const { user, loading } = useAuth();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');

  useEffect(() => {
    if (user?.role === 'provider') {
      setCurrentScreen('services');
    } else {
      setCurrentScreen('dashboard');
    }
  }, [user?.role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return authScreen === 'login' ? (
      <Login onSwitchToRegister={() => setAuthScreen('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthScreen('login')} />
    );
  }

  const handleRoleSwitch = (newRole: 'buyer' | 'provider') => {
    if (newRole === 'provider') {
      setCurrentScreen('services');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  return (
    <>
      <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      {currentScreen === 'dashboard' && user.role === 'buyer' && <BuyerDashboard />}
      {currentScreen === 'services' && user.role === 'buyer' && <BuyerDashboard />}
      {currentScreen === 'services' && user.role === 'provider' && <ProviderDashboard />}
      {currentScreen === 'dashboard' && user.role === 'provider' && <ProviderDashboard />}
      {currentScreen === 'profile' && <Profile onRoleSwitch={handleRoleSwitch} />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
