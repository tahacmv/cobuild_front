import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Package, ShoppingCart, TrendingUp, FileText, Bell } from 'lucide-react';
import RoleBasedSidebar from './RoleBasedSidebar';
import Navbar from './Navbar';

const FournisseurLayout: React.FC = () => {
  const { user } = useAuthStore();

  if (!user || user.role !== 'FOURNISSEUR') {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { icon: Package, label: 'Products', path: '/fournisseur' },
    { icon: ShoppingCart, label: 'Orders', path: '/fournisseur/orders' },
    { icon: TrendingUp, label: 'Sales', path: '/fournisseur/sales' },
    { icon: FileText, label: 'Invoices', path: '/fournisseur/invoices' },
    { icon: Bell, label: 'Notifications', path: '/fournisseur/notifications' }
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

export default FournisseurLayout;