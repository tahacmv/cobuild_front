/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Plus } from 'lucide-react';
import { projectApi } from '../../services/projectApi';
import { Project } from '../../types/project';

const getStatusColor = (status: string) => {
  const colors = {
    EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
    EN_COURS: 'bg-blue-100 text-blue-800',
    TERMINE: 'bg-green-100 text-green-800'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const MyProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectApi.getMyProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        <Link
          to="/projet/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {project.imageUrl ? (
              <img
                src={"http://localhost:8080" + project.imageUrl}
                alt={project.nom}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.nom}
                  </h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.statut)}`}>
                    {project.statut?.replace('_', ' ')}
                  </span>
                </div>
                <Link
                  to={`/projet/projects/${project.id}/edit`}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <Edit className="w-5 h-5" />
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                {project.description}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {project.taches?.length} tasks · {project.postes?.length} jobs
                </div>
                <Link
                  to={`/projet/projects/${project.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View details →
                </Link>
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full">
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No projects yet
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first project
              </p>
              <Link
                to="/projet/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Project
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;