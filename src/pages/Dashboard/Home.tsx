import React from 'react';
import { useAuthStore } from '../../store/authStore';

const Home: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.username}!</h1>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Add your dashboard widgets here */}
      </div>
    </div>
  );
};

export default Home;