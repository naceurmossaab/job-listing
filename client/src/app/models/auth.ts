export interface AuthUser {
  id: number;
  login: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
}