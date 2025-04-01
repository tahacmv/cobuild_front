import React, { useState } from 'react';
import { PlusCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { JobPost } from '../../types/project';

interface PosteBuilderProps {
  onPostsChange: (posts: JobPost[]) => void;
  initialPosts?: JobPost[];
}

const PosteBuilder: React.FC<PosteBuilderProps> = ({ onPostsChange, initialPosts = [] }) => {
  const [posts, setPosts] = useState<JobPost[]>(initialPosts);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [newSkill, setNewSkill] = useState<string>('');

  const addPost = () => {
    const newPost: JobPost = {
      titre: '',
      description: '',
      salaire: 0,
      competencesRequises: []
    };
    setPosts([...posts, newPost]);
    setExpandedPost(posts.length);
  };

  const removePost = (index: number) => {
    const newPosts = posts.filter((_, i) => i !== index);
    setPosts(newPosts);
    onPostsChange(newPosts);
    if (expandedPost === index) {
      setExpandedPost(null);
    }
  };

  const updatePost = (index: number, field: keyof JobPost, value: string | number) => {
    const newPosts = [...posts];
    newPosts[index] = { ...newPosts[index], [field]: value };
    setPosts(newPosts);
    onPostsChange(newPosts);
  };

  const addSkill = (postIndex: number) => {
    if (newSkill.trim()) {
      const newPosts = [...posts];
      newPosts[postIndex].competencesRequises.push(newSkill.trim());
      setPosts(newPosts);
      onPostsChange(newPosts);
      setNewSkill('');
    }
  };

  const removeSkill = (postIndex: number, skillIndex: number) => {
    const newPosts = [...posts];
    newPosts[postIndex].competencesRequises = newPosts[postIndex].competencesRequises.filter(
      (_, i) => i !== skillIndex
    );
    setPosts(newPosts);
    onPostsChange(newPosts);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Job Posts</h2>
        <button
          type="button"
          onClick={addPost}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Job Post
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post, postIndex) => (
          <div key={postIndex} className="border rounded-lg shadow-sm bg-white">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-grow mr-4">
                  <input
                    type="text"
                    value={post.titre}
                    onChange={(e) => updatePost(postIndex, 'titre', e.target.value)}
                    placeholder="Job title"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
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
                    onClick={() => removePost(postIndex)}
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
                      onChange={(e) => updatePost(postIndex, 'description', e.target.value)}
                      placeholder="Job description"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salary</label>
                    <input
                      type="number"
                      value={post.salaire}
                      onChange={(e) => updatePost(postIndex, 'salaire', parseFloat(e.target.value))}
                      min="0"
                      step="100"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                            onClick={() => removeSkill(postIndex, skillIndex)}
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
                        className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill(postIndex);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addSkill(postIndex)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Add
                      </button>
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

export default PosteBuilder;