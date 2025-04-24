import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import RewardsPage from './pages/RewardsPage';
import PaymentPage from './pages/PaymentPage';
import PackagingPage from './pages/PackagingPage';

function App() {
  // Auth state would normally be managed with a context or state management library
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('customer'); // 'customer' or 'business'

  // Mock login functions
  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType('customer');
  };

  // Protected route component
  const ProtectedRoute = ({ children, requiredUserType }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    if (requiredUserType && userType !== requiredUserType) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={<MainLayout isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} />}
      >
        <Route index element={<Home />} />
        
        <Route 
          path="login" 
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
        />
        
        <Route 
          path="register" 
          element={isLoggedIn ? <Navigate to="/" replace /> : <Register onRegister={handleLogin} />} 
        />
        
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute requiredUserType="customer">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="business" 
          element={
            <ProtectedRoute requiredUserType="business">
              <BusinessDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="rewards" 
          element={
            <ProtectedRoute requiredUserType="customer">
              <RewardsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="payments" 
          element={
            <ProtectedRoute requiredUserType="customer">
              <PaymentPage />
            </ProtectedRoute>
          } 
        />
        
        <Route path="packaging" element={<PackagingPage />} />
        
        {/* Redirect for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
