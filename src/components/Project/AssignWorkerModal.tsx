/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { X, User, Search } from 'lucide-react';
import { projectApi } from '../../services/projectApi';
import { toast } from 'sonner';
import { Project } from '../../types/project';

interface Worker {
  id: string;
  username: string;
  profilePictureUrl?: string;
  competences?: string[];
}

interface AssignWorkersModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  taskId: string;
  onAssign: () => void;
}

const AssignWorkersModal: React.FC<AssignWorkersModalProps> = ({
  isOpen,
  onClose,
  project,
  taskId,
  onAssign
}) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchWorkers = () => {
            if (!project) return [];
            
            // Get unique workers from job posts
            const workers = project.postes
              .filter(post => post.travailleur)
              .map(post => post.travailleur);
        
            // Remove duplicates based on worker ID
            const travailleurs = Array.from(new Map(workers.map(worker => [worker.id, worker])).values());
            setWorkers(travailleurs);
            setLoading(false);
    };

    if (isOpen) {
      fetchWorkers();
    }
  }, [isOpen, project, project.postes]);

  const handleAssign = async () => {
    try {
      await projectApi.assignWorkersToTask(project.id, taskId, selectedWorkers);
      toast.success('Workers assigned successfully');
      onAssign();
      onClose();
    } catch (err) {
      toast.error('Failed to assign workers');
    }
  };

  const filteredWorkers = workers.filter(worker =>
    worker.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.competences?.some(competence =>
      competence.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Assign Workers to Task
            </h3>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search workers..."
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
                {error}
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {filteredWorkers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No workers found</p>
                ) : (
                  <div className="space-y-2">
                    {filteredWorkers.map((worker) => (
                      <div
                        key={worker.id}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                      >
                        <input
                          type="checkbox"
                          checked={selectedWorkers.includes(worker.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedWorkers([...selectedWorkers, worker.id]);
                            } else {
                              setSelectedWorkers(selectedWorkers.filter(id => id !== worker.id));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex items-center flex-1">
                          {worker.profilePictureUrl ? (
                            <img
                              src={"http://localhost:8080"+worker.profilePictureUrl}
                              alt={worker.username}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {worker.username}
                            </p>
                            {worker.competences && worker.competences.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {worker.competences.map((competence, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {competence}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssign}
                disabled={selectedWorkers.length === 0}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Assign Workers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignWorkersModal;