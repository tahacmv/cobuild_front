import { User } from './auth';

export interface Message {
  id: string;
  sender: User;
  receiver: User;
  content: string;
  timestamp: string;
}

export interface Conversation {
  messages: Message[];
  otherUser: User;
  lastMessage: Message;
}