import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { LeadDetailPage } from './pages/LeadDetailPage';
import { PipelinePage } from './pages/PipelinePage';
import { AdvertisersPage } from './pages/AdvertisersPage';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { InventoryPage } from './pages/InventoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UsersPage } from './pages/UsersPage';
import { ReactNode } from 'react';

function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="leads" element={<ProtectedRoute roles={['admin','sales','operations']}><LeadsPage /></ProtectedRoute>} />
            <Route path="leads/:id" element={<ProtectedRoute roles={['admin','sales','operations']}><LeadDetailPage /></ProtectedRoute>} />
            <Route path="pipeline" element={<ProtectedRoute roles={['admin','sales','operations']}><PipelinePage /></ProtectedRoute>} />
            <Route path="advertisers" element={<AdvertisersPage />} />
            <Route path="restaurants" element={<RestaurantsPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="inventory" element={<ProtectedRoute roles={['admin','operations']}><InventoryPage /></ProtectedRoute>} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="users" element={<ProtectedRoute roles={['admin']}><UsersPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
