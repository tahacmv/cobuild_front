import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Settings, BarChart } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: BarChart, label: 'Analytics', path: '/dashboard/analytics' },
    ...(user?.role === 'admin' ? [
      { icon: Users, label: 'Users', path: '/dashboard/users' },
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' }
    ] : [])
  ];

  return (
    <aside className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)]">
      <nav className="mt-5 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-2 text-gray-600 rounded-lg hover:bg-gray-50 ${
                isActive ? 'bg-gray-50 text-blue-600' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;