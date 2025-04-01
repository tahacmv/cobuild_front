/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Currency as CurrencyEuro, AlertCircle } from 'lucide-react';
import { Candidature, JobPost } from '../../types/project';
import { projectApi } from '../../services/projectApi';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { useAuthStore } from '../../store/authStore';

const PosteSearchPage: React.FC = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [myApplications, setMyApplications] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('search');
  const [filters, setFilters] = useState({
    competence: '',
    projectName: '',
    minSalary: '',
    maxSalary: ''
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (filters.competence) queryParams.append('competence', filters.competence);
        if (filters.projectName) queryParams.append('projectName', filters.projectName);
        if (filters.minSalary) queryParams.append('minSalary', filters.minSalary);
        if (filters.maxSalary) queryParams.append('maxSalary', filters.maxSalary);

        const data = await projectApi.searchJobPosts(queryParams.toString());
        console.log(data);
        setPosts(data);
      } catch (err) {
        setError('Failed to load job posts');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'search') {
      fetchPosts();
    }
  }, [filters, activeTab]);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        setLoading(true);
        const data = await projectApi.searchMyApplications();
        const myCandidatureIds = new Set(data.map((c) => c.id));

        const applied = posts.filter((post) =>
          post.candidatures?.some((c) => myCandidatureIds.has(c.id))
        );
        
        setMyApplications(applied);
      } catch (err) {
        setError('Failed to load your applications');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'applications') {
      fetchMyApplications();
    }
  }, [activeTab]);

  const handleApply = async (postId: string) => {
    try {
      setApplying(postId);
      await projectApi.applyToJob(postId);
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, hasApplied: true } : post
      ));
      toast.success('Application submitted successfully');
    } catch (err) {
      toast.error('Failed to submit application');
    } finally {
      setApplying(null);
    }
  };

  const renderJobPosts = (jobPosts: JobPost[], isApplications: boolean = false) => {
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

    if (jobPosts.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isApplications ? 'No applications yet' : 'No job posts found'}
          </h3>
          <p className="text-gray-500">
            {isApplications ? 'Start applying to jobs to see them here' : 'Try adjusting your search filters'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.titre}
                  </h2>
                </div>
                <div className="text-lg font-medium text-gray-900">
                  €{post.salaire?.toLocaleString()}
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                {post.description}
              </p>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Required Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.competencesRequises?.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                {isApplications ? (
                  <div className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-green-50 text-green-700">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Application Submitted
                  </div>
                ) : post.travailleur?.id == user?.id ? (
                  <div className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-green-50 text-green-700">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Application Sent
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
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMyApplications = (jobPosts: JobPost[], isApplications: boolean = false) => {
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

    if (jobPosts.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isApplications ? 'No applications yet' : 'No job posts found'}
          </h3>
          <p className="text-gray-500">
            {isApplications ? 'Start applying to jobs to see them here' : 'Try adjusting your search filters'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.titre}
                  </h2>
                </div>
                <div className="text-lg font-medium text-gray-900">
                  €{post.salaire?.toLocaleString()}
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                {post.description}
              </p>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Required Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.competencesRequises?.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
{isApplications ? (
  <div className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-gray-100 text-gray-800">
    <AlertCircle className="w-4 h-4 mr-2" />
    Status:{' '}
    <span className="ml-2 font-semibold">
      {post.candidatures?.[0]?.statut ?? 'N/A'}
    </span>
  </div>
) : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Posts</h1>
            <p className="mt-2 text-sm text-gray-600">
              Find opportunities or check your applications
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="search">Search Jobs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="search">
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by competence..."
                  value={filters.competence}
                  onChange={(e) => setFilters(prev => ({ ...prev, competence: e.target.value }))}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Project name"
                  value={filters.projectName}
                  onChange={(e) => setFilters(prev => ({ ...prev, projectName: e.target.value }))}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <CurrencyEuro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  placeholder="Min salary"
                  value={filters.minSalary}
                  onChange={(e) => setFilters(prev => ({ ...prev, minSalary: e.target.value }))}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <CurrencyEuro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  placeholder="Max salary"
                  value={filters.maxSalary}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxSalary: e.target.value }))}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {renderJobPosts(posts)}
        </TabsContent>

        <TabsContent value="applications">
          {renderMyApplications(myApplications, true)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PosteSearchPage;