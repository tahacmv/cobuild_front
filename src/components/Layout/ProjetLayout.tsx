import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FolderKanban, Users, MessageCircle } from 'lucide-react';
import RoleBasedSidebar from './RoleBasedSidebar';
import Navbar from './Navbar';

const ProjetLayout: React.FC = () => {
  const { user } = useAuthStore();

  if (!user || !user.roles.some(role => role.name === 'PORTEURDEPROJET')) {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { icon: FolderKanban, label: 'Projects', path: '/projet' },
    { icon: Users, label: 'Team', path: '/projet/team' },
    { icon: FolderKanban, label: 'Applications', path: '/projet/applications' },
    { icon: MessageCircle, label: 'Messages', path: '/projet/messages' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <RoleBasedSidebar menuItems={menuItems} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProjetLayout;