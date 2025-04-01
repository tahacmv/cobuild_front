/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { projectApi } from '../../services/projectApi';
import { Project, ProjectStatus } from '../../types/project';
import TaskEditor from '../../components/Project/TaskEditor';
import PosteEditor from '../../components/Project/PosteEditor';

const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const data = await projectApi.getProject(id);
        setProject(data);
        if (data.imageUrl) {
          setImagePreview(data.imageUrl);
        }
      } catch (err) {
        toast.error('Failed to load project');
        navigate('/projet');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  const handleBasicInfoUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project || !id) return;

    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const updatedData = {
        nom: formData.get('nom') as string,
        description: formData.get('description') as string,
        statut: formData.get('statut') as ProjectStatus,
        adresse: formData.get('adresse') as string,
      };

      const updatedProject = await projectApi.updateProject(id, updatedData);
      setProject(updatedProject);
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error('Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!id || !selectedImage) return;

    setSaving(true);
    try {
      const updatedProject = await projectApi.uploadProjectImage(id, selectedImage);
      setProject(updatedProject);
      setImagePreview(updatedProject.imageUrl || null);
      setSelectedImage(null);
      toast.success('Project image updated successfully');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Project not found</h2>
        <button
          onClick={() => navigate('/projet')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update your project details, tasks, and job posts
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="info">Basic Info</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="jobs">Job Posts</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleBasicInfoUpdate}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="nom"
                    id="nom"
                    defaultValue={project.nom}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    defaultValue={project.description}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="statut"
                    id="statut"
                    defaultValue={project.statut}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="EN_COURS">En cours</option>
                    <option value="TERMINE">Terminé</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    id="adresse"
                    defaultValue={project.adresse || ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <div className="bg-white shadow rounded-lg p-6">
            <TaskEditor projectId={id!} tasks={project.taches} />
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <div className="bg-white shadow rounded-lg p-6">
            <PosteEditor projectId={id!} posts={project.postes} />
          </div>
        </TabsContent>

        <TabsContent value="image">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              {imagePreview && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Current Image</h3>
                  <div className="mt-2">
                    <img
                      src={"http://localhost:8080"+imagePreview}
                      alt={project.nom}
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload New Image
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {selectedImage && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {saving ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditProject;