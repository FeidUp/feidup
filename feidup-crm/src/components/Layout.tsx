import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  LayoutDashboard, Users, Building2, UtensilsCrossed, Megaphone,
  Package, BarChart3, UserCog, LogOut, Target, Kanban, ChevronLeft, Menu,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'sales', 'operations', 'advertiser', 'restaurant'] },
  { to: '/leads', icon: Target, label: 'Leads', roles: ['admin', 'sales', 'operations'] },
  { to: '/pipeline', icon: Kanban, label: 'Pipeline', roles: ['admin', 'sales', 'operations'] },
  { to: '/advertisers', icon: Building2, label: 'Advertisers', roles: ['admin', 'sales', 'operations', 'advertiser'] },
  { to: '/restaurants', icon: UtensilsCrossed, label: 'Restaurants', roles: ['admin', 'sales', 'operations', 'restaurant'] },
  { to: '/campaigns', icon: Megaphone, label: 'Campaigns', roles: ['admin', 'sales', 'operations', 'advertiser', 'restaurant'] },
  { to: '/inventory', icon: Package, label: 'Inventory', roles: ['admin', 'operations'] },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['admin', 'sales', 'operations', 'advertiser', 'restaurant'] },
  { to: '/users', icon: UserCog, label: 'Users', roles: ['admin'] },
];

export function Layout() {
  const { user, logout, isInternal } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white flex flex-col transition-all duration-200`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-sm">F</div>
              <span className="font-semibold text-lg">FeidUp CRM</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {filteredNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-800 p-3">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm font-medium shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            )}
            <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors" title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
