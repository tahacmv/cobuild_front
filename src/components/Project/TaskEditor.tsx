/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2, ChevronDown, ChevronUp, UserPlus } from 'lucide-react';
import { Task, Step, Project } from '../../types/project';
import { projectApi } from '../../services/projectApi';
import AssignWorkersModal from './AssignWorkerModal';

interface TaskEditorProps {
  projectId: string;
  tasks: Task[];
}

const TaskEditor: React.FC<TaskEditorProps> = ({ projectId, tasks: initialTasks }) => {
  const [project, setproject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Task>({
    nom: '',
    description: '',
    statut: 'COMMENCEE',
    etapes: []
  });
  const [showAddStepForm, setShowAddStepForm] = useState<number | null>(null);
  const [newStep, setNewStep] = useState<Step>({
    nom: '',
    description: '',
    statut: 'COMMENCEE'
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectApi.getProject(projectId);
        setproject(data);
      } catch (err) {
        setError('Failed to load project');
      }
    };

    fetchProject();
  }, [projectId]);
  

  const handleCreateTask = async () => {
    if (!newTask.nom.trim()) return;

    setLoading(true);
    try {
      const createdTask = await projectApi.createTask(projectId, newTask);
      setTasks([...tasks, createdTask]);
      setNewTask({
        nom: '',
        description: '',
        statut: 'COMMENCEE',
        etapes: []
      });
      setExpandedTask(tasks.length);
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (taskId: string, index: number) => {
    try {
      await projectApi.deleteTask(taskId);
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
      if (expandedTask === index) {
        setExpandedTask(null);
      }
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleUpdateTask = async (taskId: string, index: number) => {
    try {
      const updatedTask = await projectApi.updateTask(taskId, tasks[index]);
      const newTasks = [...tasks];
      newTasks[index] = updatedTask;
      setTasks(newTasks);
      setError(null);
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleAddStep = async (taskId: string, taskIndex: number) => {
    if (!newStep.description.trim()) return;

    try {
      const updatedTask = await projectApi.addTaskStep(taskId, newStep);
      const newTasks = [...tasks];
      newTasks[taskIndex] = updatedTask;
      setTasks(newTasks);
      setNewStep({
        nom: '',
        description: '',
        statut: 'COMMENCEE'
      });
      setShowAddStepForm(null);
    } catch (err) {
      setError('Failed to add step');
    }
  };

  const removeStep = async (taskId: string, taskIndex: number, stepIndex: number) => {
    try {
      const updatedTask = await projectApi.removeTaskStep(stepIndex);
      const newTasks = [...tasks];
      newTasks[taskIndex] = updatedTask;
      setTasks(newTasks);
    } catch (err) {
      setError('Failed to remove step');
    }
  };

  const updateStep = async (taskId: string, taskIndex: number, stepIndex: number, field: keyof Step, value: string) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].etapes[stepIndex] = {
      ...newTasks[taskIndex].etapes[stepIndex],
      [field]: value
    };

    try {
      await projectApi.updateTaskStep(stepIndex, newTasks[taskIndex].etapes[stepIndex]);
      setTasks(newTasks);
    } catch (err) {
      setError('Failed to update step');
    }
  };

  const handleOpenAssignModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setSelectedTaskId(null);
    setShowAssignModal(false);
  };

  const handleWorkersAssigned = async () => {
    try {
      const updatedProject = await projectApi.getProject(projectId);
      setTasks(updatedProject.taches);
    } catch (err) {
      setError('Failed to refresh tasks');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">New Task</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Name</label>
            <input
              type="text"
              value={newTask.nom}
              onChange={(e) => setNewTask({ ...newTask, nom: e.target.value })}
              placeholder="Enter task name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Enter task description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={newTask.statut}
              onChange={(e) => setNewTask({ ...newTask, statut: e.target.value as Task['statut'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="COMMENCEE">Commencée</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINEE">Terminée</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCreateTask}
              disabled={loading || !newTask.nom.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Task
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tasks?.map((task, taskIndex) => (
          <div key={task.id || taskIndex} className="border rounded-lg shadow-sm bg-white">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-grow mr-4">
                  <input
                    type="text"
                    value={task.nom}
                    onChange={(e) => {
                      const newTasks = [...tasks];
                      newTasks[taskIndex] = { ...task, nom: e.target.value };
                      setTasks(newTasks);
                    }}
                    placeholder="Task name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setExpandedTask(expandedTask === taskIndex ? null : taskIndex)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    {expandedTask === taskIndex ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => task.id && removeTask(task.id, taskIndex)}
                    className="p-2 text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {expandedTask === taskIndex && (
                <div className="mt-4 space-y-4">
                  <div>
                    <textarea
                      value={task.description}
                      onChange={(e) => {
                        const newTasks = [...tasks];
                        newTasks[taskIndex] = { ...task, description: e.target.value };
                        setTasks(newTasks);
                      }}
                      placeholder="Task description"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <select
                      value={task.statut || 'COMMENCEE'}
                      onChange={(e) => {
                        const newTasks = [...tasks];
                        newTasks[taskIndex] = { ...task, statut: e.target.value as Task['statut'] };
                        setTasks(newTasks);
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="COMMENCEE">Commencée</option>
                      <option value="EN_COURS">En cours</option>
                      <option value="TERMINEE">Terminée</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => task.id && handleUpdateTask(task.id, taskIndex)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Update Task
                    </button>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Steps</h3>
                      <button
                        type="button"
                        onClick={() => setShowAddStepForm(showAddStepForm === taskIndex ? null : taskIndex)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <PlusCircle className="w-4 h-4 mr-1" />
                        Add Step
                      </button>
                    </div>

                    <div className="space-y-4">
                      {task.etapes?.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start space-x-4">
                          <div className="flex-grow space-y-2">
                            <input
                              type="text"
                              value={step.nom}
                              onChange={(e) => task.id && updateStep(task.id, taskIndex, stepIndex, 'nom', e.target.value)}
                              placeholder="Step name"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <textarea
                              value={step.description}
                              onChange={(e) => task.id && updateStep(task.id, taskIndex, stepIndex, 'description', e.target.value)}
                              placeholder="Step description"
                              rows={2}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <select
                              value={step.statut}
                              onChange={(e) => task.id && updateStep(task.id, taskIndex, stepIndex, 'statut', e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                              <option value="COMMENCEE">Commencée</option>
                              <option value="EN_COURS">En cours</option>
                              <option value="TERMINEE">Terminée</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => task.id && removeStep(task.id, taskIndex, step.id)}
                            className="p-1 text-red-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {showAddStepForm === taskIndex && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Add New Step</h4>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={newStep.nom}
                              onChange={(e) => setNewStep({ ...newStep, nom: e.target.value })}
                              placeholder="Step name"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <textarea
                              value={newStep.description}
                              onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                              placeholder="Step description"
                              rows={2}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <select
                              value={newStep.statut}
                              onChange={(e) => setNewStep({ ...newStep, statut: e.target.value as Step['statut'] })}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                              <option value="COMMENCEE">Commencée</option>
                              <option value="EN_COURS">En cours</option>
                              <option value="TERMINEE">Terminée</option>
                            </select>
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => task.id && handleAddStep(task.id, taskIndex)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                              >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add Step
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <button
                      type="button"
                      onClick={() => task.id && handleOpenAssignModal(task.id)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign Workers
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {showAssignModal && selectedTaskId && (
        <AssignWorkersModal
          isOpen={showAssignModal}
          onClose={handleCloseAssignModal}
          project={project}
          taskId={selectedTaskId}
          onAssign={handleWorkersAssigned}
        />
      )}
    </div>
  );
};

export default TaskEditor;