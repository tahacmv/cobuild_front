import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Briefcase, Search, ListTodo, MessageCircle } from 'lucide-react';
import RoleBasedSidebar from './RoleBasedSidebar';
import Navbar from './Navbar';

const TravailleurLayout: React.FC = () => {
  const { user } = useAuthStore();

  if (!user || !user.roles.some(role => role.name === 'TRAVAILLEUR')) {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { icon: ListTodo, label: 'My Tasks', path: '/travailleur' },
    { icon: Search, label: 'Find Projects', path: '/travailleur/projects' },
    { icon: Briefcase, label: 'Job Posts', path: '/travailleur/jobs' },
    { icon: MessageCircle, label: 'Messages', path: '/travailleur/messages' }
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

export default TravailleurLayout;