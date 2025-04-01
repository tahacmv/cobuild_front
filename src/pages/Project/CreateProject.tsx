/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { projectApi } from '../../services/projectApi';
import { Project, ProjectStatus, Task, JobPost } from '../../types/project';
import TaskBuilder from '../../components/Project/TaskBuilder';
import PosteBuilder from '../../components/Project/PosteBuilder';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default marker icon
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapMarkerProps {
  onLocationSelect: (position: LatLng) => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
};

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [statut, setStatut] = useState<ProjectStatus>('EN_ATTENTE');

  const handleLocationSelect = async (position: LatLng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
      );
      const data = await response.json();
      const formattedAddress = data.display_name;
      setAddress(formattedAddress);
    } catch (error) {
      toast.error('Failed to get address from location');
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const projectData = {
        nom: nom || formData.get('nom') as string,
        description: description || formData.get('description') as string,
        statut: statut || formData.get('statut') as ProjectStatus,
        adresse: address || formData.get('adresse') as string,
        taches: tasks.length > 0 ? tasks : undefined,
        postes: posts.length > 0 ? posts : undefined
      };
      console.log(projectData);
      

      const project = await projectApi.createProject(projectData);

      if (selectedImage && project.id) {
        await projectApi.uploadProjectImage(project.id, selectedImage);
      }

      toast.success('Project created successfully');
      navigate(`/projet/projects/${project.id}`);
    } catch (err) {
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill in the project details. Only the basic information is required - you can optionally add tasks, job posts, and an image.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="info">Basic Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="jobs">Job Posts</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="nom"
                  id="nom"
                  required
                  onChange={(e) => setNom(e.target.value)}
                  value={nom}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  name="statut"
                  id="statut"
                  required
                  value={statut}
                  onChange={(e) => setStatut(e.target.value as ProjectStatus)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="TERMINE">Terminé</option>
                </select>
              </div>

              <div>
                <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <input
                  type="text"
                  name="adresse"
                  id="adresse"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  You can also select the location on the map in the Location tab
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-[400px] w-full rounded-lg overflow-hidden">
                <MapContainer
                  center={[43.6155, 7.0674]} // Default to Nice, France
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapMarker onLocationSelect={handleLocationSelect} />
                </MapContainer>
              </div>
              {address && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">Selected Address:</p>
                  <p className="mt-1 text-sm text-gray-600">{address}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <div className="bg-white shadow rounded-lg p-6">
              <TaskBuilder onTasksChange={setTasks} initialTasks={tasks} />
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="bg-white shadow rounded-lg p-6">
              <PosteBuilder onPostsChange={setPosts} initialPosts={posts} />
            </div>
          </TabsContent>

          <TabsContent value="image">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-6">
                {imagePreview && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Selected Image</h3>
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Project preview"
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Project Image
                  </label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating Project...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;