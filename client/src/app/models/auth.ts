export interface AuthUser {
  id: number;
  login: string;
  email: string;
  role: 'employer' | 'jobseeker' | 'admin';
  token: string;
}