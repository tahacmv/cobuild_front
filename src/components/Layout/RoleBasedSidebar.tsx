import React from 'react';
import { NavLink } from 'react-router-dom';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface RoleBasedSidebarProps {
  menuItems: MenuItem[];
}

const RoleBasedSidebar: React.FC<RoleBasedSidebarProps> = ({ menuItems }) => {
  return (
    <aside className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)]">
      <nav className="mt-5 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-50 ${
                isActive ? 'bg-blue-50 text-blue-600' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default RoleBasedSidebar;