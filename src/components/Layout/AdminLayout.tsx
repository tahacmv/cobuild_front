import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Users, Settings, BarChart, Building2, FileSpreadsheet } from 'lucide-react';
import RoleBasedSidebar from './RoleBasedSidebar';
import Navbar from './Navbar';

const AdminLayout: React.FC = () => {
  const { user } = useAuthStore();

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { icon: BarChart, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Building2, label: 'Organizations', path: '/admin/organizations' },
    { icon: FileSpreadsheet, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <RoleBasedSidebar menuItems={menuItems} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;