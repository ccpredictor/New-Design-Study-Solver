
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export interface Message {
  id?: string;
  role: Role;
  text: string;
  timestamp: number;
  image?: string;
  feedback?: 'like' | 'dislike' | null;
  senderName?: string;
  tokensUsed?: number;
  sources?: any[];
  metadata?: any;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface Channel {
  id: string;
  name: string;
  ownerId: string;
  members: string[];
  createdAt: any;
  updatedAt: any;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  stats?: {
    problemsSolved: number;
    tokensConsumed: number;
  };
  createdAt: any;
  lastLogin: any;
}

export interface ContactInquiry {
  id?: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  timestamp: any;
  status: 'new' | 'read' | 'resolved';
}
