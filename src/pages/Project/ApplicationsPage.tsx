import React, { useState, useEffect } from 'react';
import { User, CheckCircle, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { projectApi } from '../../services/projectApi';
import { JobPost } from '../../types/project';
import { format } from 'date-fns';

const ApplicationsPage: React.FC = () => {
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingApplication, setProcessingApplication] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await projectApi.getMyProjects();
        // Flatten all posts from all projects and filter only those with applications
        const allPosts = data.flatMap(project => 
          project.postes.filter(post => post.candidatures && post.candidatures.length > 0)
        );
        setPosts(allPosts);
      } catch (err) {
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleApplicationAction = async (postId: string, applicationId: string, action: 'accept' | 'reject') => {
    setProcessingApplication(applicationId);
    try {
      if (action === 'accept') {
        await projectApi.acceptApplication(applicationId);
      } else {
        await projectApi.rejectApplication(applicationId);
      }
      
      // Update the local state to reflect the change
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            candidatures: post.candidatures?.map(app => 
              app.id === applicationId 
                ? { ...app, statut: action === 'accept' ? 'ACCEPTEE' : 'REJETEE' }
                : app
            )
          };
        }
        return post;
      }));

      toast.success(`Application ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);
    } catch (err) {
      toast.error(`Failed to ${action} application`);
    } finally {
      setProcessingApplication(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTEE':
        return 'bg-green-100 text-green-800';
      case 'REJETEE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTEE':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJETEE':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage applications for your job posts
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            When people apply to your job posts, they'll appear here
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{post.titre}</h2>
                <p className="mt-1 text-sm text-gray-600">{post.description}</p>
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-900">
                    €{post.salaire.toLocaleString()}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
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
              </div>

              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Applications</h3>
                <div className="space-y-4">
                  {post.candidatures?.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        {application.travailleur?.profilePictureUrl ? (
                          <img
                            src={"http://localhost:8080"+application.travailleur?.profilePictureUrl}
                            alt={"http://localhost:8080"+application.travailleur?.username}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {application.travailleur?.username}
                          </p>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.statut)}`}>
                              {getStatusIcon(application.statut)}
                              <span className="ml-1">
                                {application.statut === 'ACCEPTEE'
                                  ? 'Accepted'
                                  : application.statut === 'REJETEE'
                                  ? 'Rejected'
                                  : 'Pending'}
                              </span>
                            </span>
                            <span className="text-xs text-gray-500">
                              Applied {format(new Date(application.dateCandidature), 'PPP')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {application.statut === 'EN_ATTENTE' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApplicationAction(post.id!, application.id, 'accept')}
                            disabled={processingApplication === application.id}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleApplicationAction(post.id!, application.id, 'reject')}
                            disabled={processingApplication === application.id}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;