import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MessageSquare, Send } from 'lucide-react';
import { messageApi } from '../../services/messageApi';
import { Message, Conversation } from '../../types/message';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const MessagingInboxPage: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessageUsername, setNewMessageUsername] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const data = await messageApi.getInbox();
        setConversations(data);
      } catch (err) {
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, []);

  const handleConversationClick = (username: string) => {
    navigate(`/messages/${username}`);
  };

  const handleStartNewMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageUsername.trim()) return;

    try {
      // Send an initial empty message to create the conversation
      await messageApi.sendMessage(newMessageUsername, '');
      navigate(`/messages/${newMessageUsername}`);
    } catch (err) {
      toast.error('User not found or you cannot message this user');
    }
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <button
          onClick={() => setShowNewMessage(!showNewMessage)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          New Message
        </button>
      </div>

      {showNewMessage && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <form onSubmit={handleStartNewMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessageUsername}
              onChange={(e) => setNewMessageUsername(e.target.value)}
              placeholder="Enter username"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Start Chat
            </button>
          </form>
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No messages yet</h3>
          <p className="mt-1 text-sm text-gray-500">Start a conversation with someone</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {conversations.map((conversation) => (
            <div
              key={conversation.sender.id}
              onClick={() => handleConversationClick(conversation.sender.username)}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {conversation.sender.profilePictureUrl ? (
                    <img
                      src={"http://localhost:8080"+conversation.sender.profilePictureUrl}
                      alt={conversation.sender.username}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.sender.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(conversation.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      <span className="font-medium text-gray-900">
                        {conversation.sender.id === conversation.sender.id ? '' : 'You: '}
                      </span>
                      {conversation.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagingInboxPage;