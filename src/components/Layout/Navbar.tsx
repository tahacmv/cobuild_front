import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to={`/${user?.roles[0].name.toLowerCase()}/profile`}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
            >
              {user?.profilePictureUrl ? (
                <img
                  src={"http://localhost:8080"+user.profilePictureUrl}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="text-sm">{user?.username}</span>
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;