import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, List, Map as MapIcon } from 'lucide-react';
import { Project, ProjectStatus } from '../../types/project';
import { projectApi } from '../../services/projectApi';
import { useAuthStore } from '../../store/authStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ProjectSearchPage: React.FC = () => {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [radius, setRadius] = useState(15);
  const [address, setAddress] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let data: Project[];
        
        if (view === 'map' && address) {
          data = await projectApi.getNearbyProjects(address, radius);
        } else if (keyword) {
          data = await projectApi.searchProjectsByKeyword(keyword);
        } else {
          data = await projectApi.getTravailleurProjects();
        }
        
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    // Add debounce for keyword search
    const timeoutId = setTimeout(fetchProjects, 500);
    return () => clearTimeout(timeoutId);
  }, [keyword, address, radius, view]);

  const getStatusColor = (status: string) => {
    const colors = {
      EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
      EN_COURS: 'bg-blue-100 text-blue-800',
      TERMINE: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getProjectDetailsPath = (projectId: string) => {
    const role = user?.roles[0].name.toLowerCase();
    return role === 'porteurdeprojet' ? `/projet/projects/${projectId}` : `/travailleur/projects/${projectId}`;
  };

  const renderProjectCard = (project: Project) => (
    <div
      key={project.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {project.imageUrl ? (
        <img
          src={"http://localhost:8080"+project.imageUrl}
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
              {project.statut.replace('_', ' ')}
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600 line-clamp-3">
          {project.description}
        </p>
        {project.adresse && (
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            {project.adresse}
          </div>
        )}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {project.postes?.length || 0} open positions
          </div>
          <Link
            to={getProjectDetailsPath(project.id!)}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Find Projects</h1>
        <p className="mt-2 text-sm text-gray-600">
          Discover projects that match your skills and interests
        </p>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'map')}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <TabsList>
              <TabsTrigger value="list">
                <List className="w-4 h-4 mr-2" />
                List View
              </TabsTrigger>
              <TabsTrigger value="map">
                <MapIcon className="w-4 h-4 mr-2" />
                Map View
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          {view === 'list' ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter an address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Search Radius (km)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1 km</span>
                    <span>{radius} km</span>
                    <span>50 km</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <TabsContent value="list">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => renderProjectCard(project))}

              {projects.length === 0 && (
                <div className="col-span-full">
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No projects found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="map">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-[600px]">
              <MapContainer
                center={[43.6155, 7.0674]} // Default to Nice, France
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {projects.map((project) => (
                  project.latitude && project.longitude ? (
                    <Marker
                      key={project.id}
                      position={[project.latitude, project.longitude]}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-medium text-gray-900">{project.nom}</h3>
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                          <Link
                            to={getProjectDetailsPath(project.id!)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500 mt-2 block"
                          >
                            View details →
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  ) : null
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Nearby Projects</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => renderProjectCard(project))}

              {projects.length === 0 && (
                <div className="col-span-full">
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No nearby projects found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search radius or entering a different address
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectSearchPage;