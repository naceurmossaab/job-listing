export interface Job {
  id: number;
  title: string;
  description: string;
  salary: string;
  location: string;
  category: string;
  employerId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApiResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
}