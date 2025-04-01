/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState } from 'react';
import { PlusCircle, Trash2, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { JobPost } from '../../types/project';
import { projectApi } from '../../services/projectApi';

interface PosteEditorProps {
  projectId: string;
  posts: JobPost[];
}

const PosteEditor: React.FC<PosteEditorProps> = ({ projectId, posts: initialPosts }) => {
  const [posts, setPosts] = useState<JobPost[]>(initialPosts);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState<string>('');
  const [newPost, setNewPost] = useState<JobPost>({
    titre: '',
    description: '',
    salaire: 0,
    competencesRequises: []
  });

  const handleCreatePost = async () => {
    if (!newPost.titre.trim()) return;

    setLoading(true);
    try {
      const createdPost = await projectApi.createJobPost(projectId, newPost);
      setPosts([...posts, createdPost]);
      setNewPost({
        titre: '',
        description: '',
        salaire: 0,
        competencesRequises: []
      });
      setExpandedPost(posts.length);
    } catch (err) {
      setError('Failed to create job post');
    } finally {
      setLoading(false);
    }
  };

  const removePost = async (postId: string, index: number) => {
    try {
      await projectApi.deleteJobPost(postId);
      const newPosts = posts.filter((_, i) => i !== index);
      setPosts(newPosts);
      if (expandedPost === index) {
        setExpandedPost(null);
      }
    } catch (err) {
      setError('Failed to delete job post');
    }
  };

  const updatePost = async (postId: string, index: number, field: keyof JobPost, value: string | number) => {
    const newPosts = [...posts];
    newPosts[index] = { ...newPosts[index], [field]: value };
    
    try {
      await projectApi.updateJobPost(projectId, postId, newPosts[index]);
      setPosts(newPosts);
    } catch (err) {
      setError('Failed to update job post');
    }
  };

  const addSkillToNewPost = () => {
    if (newSkill.trim() && !newPost.competencesRequises.includes(newSkill.trim())) {
      setNewPost({
        ...newPost,
        competencesRequises: [...newPost.competencesRequises, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkillFromNewPost = (skillToRemove: string) => {
    setNewPost({
      ...newPost,
      competencesRequises: newPost.competencesRequises.filter(skill => skill !== skillToRemove)
    });
  };

  const addSkillToExistingPost = async (postId: string, postIndex: number) => {
    if (!newSkill.trim()) return;

    const newPosts = [...posts];
    newPosts[postIndex].competencesRequises.push(newSkill.trim());
    
    try {
      await projectApi.updateJobPost(projectId, postId, newPosts[postIndex]);
      setPosts(newPosts);
      setNewSkill('');
    } catch (err) {
      setError('Failed to add skill');
    }
  };

  const removeSkillFromExistingPost = async (postId: string, postIndex: number, skillToRemove: string) => {
    const newPosts = [...posts];
    newPosts[postIndex].competencesRequises = newPosts[postIndex].competencesRequises.filter(
      skill => skill !== skillToRemove
    );
    
    try {
      await projectApi.updateJobPost(projectId, postId, newPosts[postIndex]);
      setPosts(newPosts);
    } catch (err) {
      setError('Failed to remove skill');
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
        <h2 className="text-lg font-medium text-gray-900 mb-4">New Job Post</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              value={newPost.titre}
              onChange={(e) => setNewPost({ ...newPost, titre: e.target.value })}
              placeholder="Enter job title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              placeholder="Enter job description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="number"
              value={newPost.salaire}
              onChange={(e) => setNewPost({ ...newPost, salaire: parseFloat(e.target.value) })}
              min="0"
              step="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {newPost.competencesRequises.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkillFromNewPost(skill)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a required skill"
                className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkillToNewPost();
                  }
                }}
              />
              <button
                type="button"
                onClick={addSkillToNewPost}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCreatePost}
              disabled={loading || !newPost.titre.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Job Post
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post, postIndex) => (
          <div key={post.id || postIndex} className="border rounded-lg shadow-sm bg-white">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-grow mr-4">
                  <input
                    type="text"
                    value={post.titre}
                    onChange={(e) => post.id && updatePost(post.id, postIndex, 'titre', e.target.value)}
                    placeholder="Job title"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium text-gray-700"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    {post.candidatures?.length || 0}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedPost(expandedPost === postIndex ? null : postIndex)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    {expandedPost === postIndex ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => post.id && removePost(post.id, postIndex)}
                    className="p-2 text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {expandedPost === postIndex && (
                <div className="mt-4 space-y-4">
                  <div>
                    <textarea
                      value={post.description}
                      onChange={(e) => post.id && updatePost(post.id, postIndex, 'description', e.target.value)}
                      placeholder="Job description"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salary</label>
                    <input
                      type="number"
                      value={post.salaire}
                      onChange={(e) => post.id && updatePost(post.id, postIndex, 'salaire', parseFloat(e.target.value))}
                      min="0"
                      step="100"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Skills
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.competencesRequises.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => post.id && removeSkillFromExistingPost(post.id, postIndex, skill)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a required skill"
                        className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            post.id && addSkillToExistingPost(post.id, postIndex);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => post.id && addSkillToExistingPost(post.id, postIndex)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {post.candidatures && post.candidatures.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Applications</h4>
                      <div className="space-y-2">
                        {post.candidatures.map((candidature) => (
                          <div
                            key={candidature.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                          >
                            <div className="flex items-center">
                              <img
                                src={"http://localhost:8080"+candidature.travailleur.profilePictureUrl || 'https://via.placeholder.com/40'}
                                alt={candidature.travailleur.username}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                              <span className="text-sm font-medium">{candidature.travailleur.username}</span>
                            </div>
                            <button
                              type="button"
                              className="text-sm text-blue-600 hover:text-blue-500"
                            >
                              View Profile
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PosteEditor;