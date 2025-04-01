import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AdminLayout from './components/Layout/AdminLayout';
import TravailleurLayout from './components/Layout/TravailleurLayout';
import ProjetLayout from './components/Layout/ProjetLayout';
import FournisseurLayout from './components/Layout/FournisseurLayout';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import TravailleurHome from './pages/Dashboard/TravailleurHome';
import Profile from './pages/Profile';
import MyProjects from './pages/Project/MyProjects';
import CreateProject from './pages/Project/CreateProject';
import EditProject from './pages/Project/EditProject';
import ProjectDetails from './pages/Project/ProjectDetails';
import ProjectSearchPage from './pages/Project/ProjectSearchPage';
import PosteSearchPage from './pages/Project/PosteSearchPage';
import MessagingInboxPage from './pages/Messages/MessagingInboxPage';
import ChatWindow from './pages/Messages/ChatWindow';
import AdminDashboard from './pages/Admin/AdminDashboard';
import { useAuthStore } from './store/authStore';
import MainNavbar from './components/Layout/MainNavbar';
import ApplicationsPage from './pages/Project/ApplicationsPage';
import TravailleurProjectDetails from './pages/Project/TravailleurProjectDetails';

function App() {
  const { isAuthenticated, user, isLoading, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getRedirectPath = () => {
    if (!isAuthenticated || !user) return '/login';
    const role = user.roles[0].name.toLowerCase();
    if (role === 'porteurdeprojet') return '/projet';
    return `/${role}`;
  };

  return (
    <BrowserRouter>
    <MainNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={getRedirectPath()} replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={getRedirectPath()} replace />} />
        <Route path="messages/:username" element={<ChatWindow />} />
        <Route path="messages" element={<MessagingInboxPage />} />

        {/* Role-specific layouts */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<Profile />} />
          
        </Route>

        <Route path="/travailleur/*" element={<TravailleurLayout />}>
          <Route index element={<TravailleurHome />} />
          <Route path="projects" element={<ProjectSearchPage />} />
          <Route path="projects/:id" element={<TravailleurProjectDetails />} />
          <Route path="jobs" element={<PosteSearchPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/projet/*" element={<ProjetLayout />}>
          <Route index element={<MyProjects />} />
          <Route path="create" element={<CreateProject />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="projects/:id/edit" element={<EditProject />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/fournisseur/*" element={<FournisseurLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;