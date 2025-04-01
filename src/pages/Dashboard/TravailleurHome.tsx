import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { projectApi } from '../../services/projectApi';
import { Task, Step } from '../../types/project';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const TravailleurHome: React.FC = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStep, setUpdatingStep] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await projectApi.getMyTasks();
        setTasks(data);
      } catch (err) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleUpdateStepStatus = async (stepId: string, newStatus: Step['statut']) => {
    try {
      setUpdatingStep(stepId);
      const data = await projectApi.updateStepStatus(stepId, newStatus);
      // Update local state
      setTasks(tasks.map(task => ({
        ...task,
        etapes: task.etapes.map(step => 
          step.id === stepId ? { ...step, statut: newStatus } : step
        )
      })));

      toast.success('Step status updated successfully');
    } catch (err) {
      toast.error('Failed to update step status');
    } finally {
      setUpdatingStep(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TERMINEE':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'EN_COURS':
      case 'COMMENCEE':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const calculateProgress = (task: Task) => {
    if (!task.etapes || task.etapes.length === 0) return 0;
    const completedSteps = task.etapes.filter(step => step.statut === 'TERMINEE').length;
    return Math.round((completedSteps / task.etapes.length) * 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-300';
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
        <p className="mt-2 text-sm text-gray-600">
          Here are your assigned tasks and their progress
        </p>
      </div>

      <div className="space-y-6">
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900">No tasks assigned</h3>
            <p className="mt-2 text-sm text-gray-500">
              Browse available projects and apply for positions to get started
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{task.nom}</h3>
                    <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                  </div>
                  {getStatusIcon(task.statut || 'NON_COMMENCEE')}
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-700">{calculateProgress(task)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getProgressColor(calculateProgress(task))}`}
                      style={{ width: `${calculateProgress(task)}%` }}
                    ></div>
                  </div>
                </div>

                {task.etapes.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Steps</h4>
                    <div className="space-y-4">
                      {task.etapes.map((step) => (
                        <div key={step.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{step.nom}</p>
                            <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                          </div>
                          <div className="ml-4 flex items-center space-x-4">
                            <select
                              value={step.statut}
                              onChange={(e) => step.id && handleUpdateStepStatus(step.id, e.target.value as Step['statut'])}
                              disabled={updatingStep === step.id}
                              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            >
                              <option value="NON_COMMENCEE">Non commencée</option>
                              <option value="COMMENCEE">Commencée</option>
                              <option value="TERMINEE">Terminée</option>
                            </select>
                            {updatingStep === step.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            ) : (
                              getStatusIcon(step.statut)
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TravailleurHome;