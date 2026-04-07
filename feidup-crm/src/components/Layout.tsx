import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import {
  LayoutDashboard, Building2, UtensilsCrossed, Megaphone,
  Package, BarChart3, UserCog, LogOut, Target, Kanban, ChevronLeft, Menu,
  QrCode, Coffee, Sparkles, Sun, Moon, MapPin,
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'sales', 'operations', 'advertiser', 'restaurant'] },
  // Internal CRM
  { to: '/leads', icon: Target, label: 'Leads', roles: ['admin', 'sales', 'operations'], section: 'CRM' },
  { to: '/pipeline', icon: Kanban, label: 'Pipeline', roles: ['admin', 'sales', 'operations'] },
  { to: '/advertisers', icon: Building2, label: 'Advertisers', roles: ['admin', 'sales', 'operations'] },
  { to: '/restaurants', icon: UtensilsCrossed, label: 'Restaurants', roles: ['admin', 'sales', 'operations'] },
  { to: '/campaigns', icon: Megaphone, label: 'Campaigns', roles: ['admin', 'sales', 'operations'] },
  { to: '/map', icon: MapPin, label: 'Map View', roles: ['admin', 'sales', 'operations'] },
  { to: '/inventory', icon: Package, label: 'Inventory', roles: ['admin', 'operations'] },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['admin', 'sales', 'operations'] },
  { to: '/users', icon: UserCog, label: 'Users', roles: ['admin'] },
  // Cafe portal
  { to: '/cafe/inventory', icon: Package, label: 'My Inventory', roles: ['restaurant'], section: 'My Cafe' },
  { to: '/cafe/qr-analytics', icon: QrCode, label: 'QR Analytics', roles: ['restaurant'] },
  { to: '/cafe/profile', icon: Coffee, label: 'Cafe Profile', roles: ['restaurant'] },
  // Advertiser portal
  { to: '/advertiser/analytics', icon: QrCode, label: 'QR Analytics', roles: ['advertiser'], section: 'My Campaigns' },
  { to: '/advertiser/recommendations', icon: Sparkles, label: 'Audience Preferences', roles: ['advertiser'] },
];

export function Layout() {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = navItems.filter(item => user && item.roles.includes(user.role));

  // Group items by section
  let lastSection = '';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-60'} flex flex-col transition-all duration-300 ease-out border-r`}
        style={{ background: 'var(--color-sidebar)', borderColor: 'var(--color-border)' }}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b" style={{ borderColor: 'var(--color-border)' }}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-red-600/20">F</div>
              <span className="font-semibold text-[15px] text-white tracking-tight">FeidUp</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors">
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
          {filteredNav.map((item) => {
            const showSection = !collapsed && item.section && item.section !== lastSection;
            if (item.section) lastSection = item.section;

            return (
              <div key={item.to}>
                {showSection && (
                  <p className="px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                    {item.section}
                  </p>
                )}
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-red-600/10 text-red-500'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1 bottom-1 w-0.5 bg-red-500 rounded-full"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon size={18} className="shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </>
                  )}
                </NavLink>
              </div>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t p-3" style={{ borderColor: 'var(--color-border)' }}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-[11px] font-semibold text-white shrink-0 shadow-lg shadow-red-600/20">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-[11px] text-gray-500 capitalize">{user?.role}</p>
              </div>
            )}
            <button onClick={toggleTheme}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-600 hover:text-gray-400 transition-colors"
              title={isDark ? 'Light mode' : 'Dark mode'}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-600 hover:text-gray-400 transition-colors"
              title="Sign out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto" style={{ background: 'var(--color-bg-primary)' }}>
        <Outlet />
      </main>
    </div>
  );
}
