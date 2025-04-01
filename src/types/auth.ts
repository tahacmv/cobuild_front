export type Role = 'TRAVAILLEUR' | 'PORTEURDEPROJET' | 'ADMIN' | 'FOURNISSEUR';

export interface UserRole {
  id: string;
  name: Role;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  profilePictureUrl?: string;
  competences?: string[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  roleName: Role;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  competences?: string[];
  profilePictureUrl?: string;
}