import { User as BaseUser } from './auth';
import { Project as BaseProject } from './project';

export interface AdminStats {
  users: {
    total: number;
    byRole: Record<string, number>;
  };
  projects: {
    total: number;
    active: number;
    pending: number;
  };
  postes: {
    total: number;
    open: number;
  };
  candidatures: {
    total: number;
    accepted: number;
    pending: number;
  };
}

export interface User extends BaseUser {
  createdAt: string;
  lastLogin: string;
  status: 'active' | 'banned';
}

export interface Project extends BaseProject {
  moderationStatus: 'pending' | 'approved' | 'rejected';
  moderationReason?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  user: User;
  action: string;
  details: string;
  timestamp: string;
}