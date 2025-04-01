export type ProjectStatus = 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE';
export type TaskStatus = 'EN_COURS' | 'TERMINEE' | 'COMMENCEE';
export interface Worker {
  id: string;
  username: string;
  profilePictureUrl?: string;
  competences?: string[];
}
export interface Step {
  id?: string;
  nom?: string;
  description: string;
  statut: TaskStatus;
}

export interface Task {
  id?: string;
  nom: string;
  description: string;
  statut: TaskStatus | null;
  etapes: Step[];
  travailleurs?: Worker[];
}

export interface Candidature {
  id: string;
  statut: 'ACCEPTEE' | 'EN_ATTENTE' | 'REJETEE';
  dateCandidature: string;
  travailleur?: any;
}

export interface JobPost {
  id?: string;
  titre: string;
  description: string;
  salaire: number;
  competencesRequises: string[];
  travailleur?: any;
  candidatures?: Candidature[];
}

export interface Project {
  id?: string;
  nom: string;
  description: string;
  statut: ProjectStatus;
  archived: boolean;
  imageUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  adresse?: string | null;
  taches?: Task[];
  postes?: JobPost[];
  materiels?: any[];
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface CreateProjectDTO {
  nom: string;
  description: string;
  statut: ProjectStatus;
  adresse?: string;
  taches?: Task[];
  postes?: JobPost[];
}