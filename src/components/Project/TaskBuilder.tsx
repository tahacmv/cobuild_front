import React, { useState } from 'react';
import { PlusCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Task, Step } from '../../types/project';

interface TaskBuilderProps {
  onTasksChange: (tasks: Task[]) => void;
  initialTasks?: Task[];
}

const TaskBuilder: React.FC<TaskBuilderProps> = ({ onTasksChange, initialTasks = [] }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);

  const addTask = () => {
    const newTask: Task = {
      nom: '',
      description: '',
      statut: 'NON_COMMENCEE',
      etapes: []
    };
    setTasks([...tasks, newTask]);
    setExpandedTask(tasks.length);
  };

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    onTasksChange(newTasks);
    if (expandedTask === index) {
      setExpandedTask(null);
    }
  };

  const updateTask = (index: number, field: keyof Task, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
    onTasksChange(newTasks);
  };

  const addStep = (taskIndex: number) => {
    const newTasks = [...tasks];
    const newStep: Step = {
      nom: '',
      description: '',
      statut: 'NON_COMMENCEE'
    };
    newTasks[taskIndex].etapes.push(newStep);
    setTasks(newTasks);
    onTasksChange(newTasks);
  };

  const removeStep = (taskIndex: number, stepIndex: number) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].etapes = newTasks[taskIndex].etapes.filter((_, i) => i !== stepIndex);
    setTasks(newTasks);
    onTasksChange(newTasks);
  };

  const updateStep = (taskIndex: number, stepIndex: number, field: keyof Step, value: string) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].etapes[stepIndex] = {
      ...newTasks[taskIndex].etapes[stepIndex],
      [field]: value
    };
    setTasks(newTasks);
    onTasksChange(newTasks);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
        <button
          type="button"
          onClick={addTask}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task, taskIndex) => (
          <div key={taskIndex} className="border rounded-lg shadow-sm bg-white">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-grow mr-4">
                  <input
                    type="text"
                    value={task.nom}
                    onChange={(e) => updateTask(taskIndex, 'nom', e.target.value)}
                    placeholder="Task name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                    onClick={() => removeTask(taskIndex)}
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
                      onChange={(e) => updateTask(taskIndex, 'description', e.target.value)}
                      placeholder="Task description"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <select
                      value={task.statut}
                      onChange={(e) => updateTask(taskIndex, 'statut', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="NON_COMMENCEE">Non commencée</option>
                      <option value="EN_COURS">En cours</option>
                      <option value="TERMINEE">Terminée</option>
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Steps</h3>
                      <button
                        type="button"
                        onClick={() => addStep(taskIndex)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <PlusCircle className="w-4 h-4 mr-1" />
                        Add Step
                      </button>
                    </div>

                    <div className="space-y-3">
                      {task.etapes.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start space-x-4">
                          <div className="flex-grow space-y-2">
                            <input
                              type="text"
                              value={step.nom}
                              onChange={(e) => updateStep(taskIndex, stepIndex, 'nom', e.target.value)}
                              placeholder="Step name"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            <textarea
                              value={step.description}
                              onChange={(e) => updateStep(taskIndex, stepIndex, 'description', e.target.value)}
                              placeholder="Step description"
                              rows={2}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            <select
                              value={step.statut}
                              onChange={(e) => updateStep(taskIndex, stepIndex, 'statut', e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                              <option value="NON_COMMENCEE">Non commencée</option>
                              <option value="EN_COURS">En cours</option>
                              <option value="TERMINEE">Terminée</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeStep(taskIndex, stepIndex)}
                            className="p-1 text-red-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBuilder;