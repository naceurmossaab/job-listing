export interface IUser {
  id: number;
  name: string;
  login: string;
  email: string;
  role: 'employer' | 'jobseeker' | 'admin';
}