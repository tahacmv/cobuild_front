/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, User } from 'lucide-react';
import { messageApi } from '../../services/messageApi';
import { Message } from '../../types/message';
import { useAuthStore } from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';

const ChatWindow: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!username) return;
      try {
        const data = await messageApi.getConversation(username);
        setMessages(data);
      } catch (err) {
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up polling for new messages
    const pollInterval = setInterval(fetchMessages, 5000);
    return () => clearInterval(pollInterval);
  }, [username]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !newMessage.trim()) return;

    setSending(true);
    try {
      const sentMessage = await messageApi.sendMessage(username, newMessage.trim());
      const data = await messageApi.getConversation(username);
      setMessages(data);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const otherUser = messages[0]?.sender.id === currentUser?.id 
    ? messages[0]?.receiver 
    : messages[0]?.sender;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            {otherUser?.profilePictureUrl ? (
              <img
                src={"http://localhost:8080"+otherUser.profilePictureUrl}
                alt={otherUser.username}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {otherUser?.username}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.sender?.id === currentUser?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-xs md:max-w-md ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {!isCurrentUser && (
                    <div className="flex-shrink-0">
                      {message.sender?.profilePictureUrl ? (
                        <img
                          src={"http://localhost:8080"+message.sender.profilePictureUrl}
                          alt={message.sender.username}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSend} className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;