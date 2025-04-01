import React, { useState, useRef } from 'react';
import { User, Camera, Plus, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/api';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const { user, setAuth } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    competences: user?.competences || [],
    newCompetence: ''
  });
  const [error, setError] = useState('');

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { user: updatedUser } = await authApi.uploadProfilePicture(file);
      toast.success('Profile picture updated successfully');
    } catch (err) {
      toast.error('Failed to update profile picture');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { user: updatedUser } = await authApi.updateProfile({
        username: formData.name,
        email: formData.email,
        competences: formData.competences
      });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const addCompetence = () => {
    if (formData.newCompetence.trim() && !formData.competences.includes(formData.newCompetence.trim())) {
      setFormData({
        ...formData,
        competences: [...formData.competences, formData.newCompetence.trim()],
        newCompetence: ''
      });
    }
  };

  const removeCompetence = (competence: string) => {
    setFormData({
      ...formData,
      competences: formData.competences.filter(c => c !== competence)
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              {user?.profilePictureUrl ? (
                <img
                  src={"http://localhost:8080"+user.profilePictureUrl}
                  alt={user.username}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
              >
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePictureChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {formData.competences.map((competence) => (
                  <span
                    key={competence}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {competence}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeCompetence(competence)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={formData.newCompetence}
                    onChange={(e) => setFormData({ ...formData, newCompetence: e.target.value })}
                    placeholder="Add a skill"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCompetence();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCompetence}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </button>
                </div>
              )}
              {!isEditing && formData.competences.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  No skills added yet. Click edit to add your skills.
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.username || '',
                        email: user?.email || '',
                        competences: user?.competences || [],
                        newCompetence: ''
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;