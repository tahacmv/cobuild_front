/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, MapPin, Users, Calendar, CheckCircle2, Clock, AlertCircle, User } from 'lucide-react';
import { toast } from 'sonner';
import { projectApi } from '../../services/projectApi';
import { Project, TaskStatus } from '../../types/project';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';

const getStatusColor = (status: string) => {
  const colors = {
    EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
    EN_COURS: 'bg-blue-100 text-blue-800',
    TERMINE: 'bg-green-100 text-green-800'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getTaskStatusIcon = (status: TaskStatus | null) => {
  switch (status) {
    case 'TERMINEE':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'EN_COURS':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    case 'COMMENCEE':
      return <Clock className="w-5 h-5 text-blue-500" />;
    default:
      return <AlertCircle className="w-5 h-5 text-gray-500" />;
  }
};

const TravailleurProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const data = await projectApi.getTravailleurProject(id);
        setProject(data);
      } catch (err) {
        setError('Failed to load project details');
        toast.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const getCollaborators = () => {
    if (!project) return [];
    
    // Get unique workers from job posts
    const workers = project.postes
      .filter(post => post.travailleur)
      .map(post => post.travailleur);

    // Remove duplicates based on worker ID
    return Array.from(new Map(workers.map(worker => [worker.id, worker])).values());
  };

  const handleApply = async (postId: string) => {
    try {
      setApplying(postId);
      await projectApi.applyToJob(postId);
      
      // Update the local state to show the application was submitted
      setProject(prev => {
        if (!prev) return null;
        return {
          ...prev,
          postes: prev.postes?.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  candidatures: [...(post.candidatures || []), {
                    id: 'temp',
                    statut: 'EN_ATTENTE',
                    dateCandidature: new Date().toISOString()
                  }]
                }
              : post
          )
        };
      });
      
      toast.success('Application submitted successfully');
    } catch (err) {
      toast.error('Failed to submit application');
    } finally {
      setApplying(null);
    }
  };

  const getApplicationStatus = (post: any) => {
    if (!post.candidatures || post.candidatures.length === 0) return null;
    return post.candidatures[post.candidatures.length - 1].statut;
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
          <p className="mt-2 text-gray-600">The project you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate('/travailleur/projects')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Projects
          </button>
        </div>
      </div>
    );
  }

  const collaborators = getCollaborators();
  const isPorteurDeProjet = user?.roles.some(role => role.name === 'PORTEURDEPROJET');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.nom}</h1>
          <div className="mt-2 flex items-center space-x-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.statut)}`}>
              {project.statut.replace('_', ' ')}
            </span>
            {project.adresse && (
              <span className="inline-flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {project.adresse}
              </span>
            )}
          </div>
        </div>
        {isPorteurDeProjet && (
          <Link
            to={`/projet/projects/${project.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Project
          </Link>
        )}
      </div>

      {project.imageUrl && (
        <div className="mb-8">
          <img
            src={"http://localhost:8080"+project.imageUrl}
            alt={project.nom}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tasks</h2>
            <div className="space-y-4">
              {project.taches?.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{task.nom}</h3>
                      <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                    </div>
                    {getTaskStatusIcon(task.statut)}
                  </div>
                  {task.etapes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Steps</h4>
                      <div className="space-y-2">
                        {task.etapes.map((step, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{step.description}</span>
                            {getTaskStatusIcon(step.statut)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Collaborators</h2>
            {collaborators.length > 0 ? (
              <div className="space-y-4">
                {collaborators.map((worker) => (
                  <div key={worker.id} className="flex items-center space-x-3">
                    {worker.profilePictureUrl ? (
                      <img
                        src={"http://localhost:8080"+worker.profilePictureUrl}
                        alt={worker.username}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{worker.username}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {worker.competences?.map((competence, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {competence}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No collaborators yet</p>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Job Posts</h2>
            <div className="space-y-4">
              {project.postes?.map((post) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <h3 className="text-base font-medium text-gray-900">{post.titre}</h3>
                  <p className="mt-1 text-sm text-gray-600">{post.description}</p>
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-900">
                      €{post.salaire.toLocaleString()}
                    </span>
                  </div>
                  {post.competencesRequises.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {post.competencesRequises.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                {!post.travailleur && (
                    <div className="mt-4">
                      {getApplicationStatus(post) ? (
                        <div className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                          getApplicationStatus(post) === 'ACCEPTEE'
                            ? 'bg-green-50 text-green-700'
                            : getApplicationStatus(post) === 'REJETEE'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {getApplicationStatus(post) === 'ACCEPTEE'
                            ? 'Application Accepted'
                            : getApplicationStatus(post) === 'REJETEE'
                            ? 'Application Rejected'
                            : 'Application Pending'}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => post.id && handleApply(post.id)}
                          disabled={applying === post.id}
                          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {applying === post.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Applying...
                            </>
                          ) : (
                            'Apply Now'
                          )}
                        </button>
                      )}
                    </div>
                  )}
                  {post.travailleur && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center">
                        {post.travailleur.profilePictureUrl ? (
                          <img
                            src={"http://localhost:8080"+post.travailleur.profilePictureUrl}
                            alt={post.travailleur.username}
                            className="h-8 w-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                        <span className="text-sm text-gray-600">
                          Assigned to {post.travailleur.username}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Project Info</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {project.createdAt && format(new Date(project.createdAt), 'PPP')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {project.updatedAt && format(new Date(project.updatedAt), 'PPP')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.statut)}`}>
                    {project.statut.replace('_', ' ')}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravailleurProjectDetails;