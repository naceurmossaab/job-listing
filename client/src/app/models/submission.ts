import { Job } from "./job";

export interface ISubmission {
  id: number;
  fullName: string;
  email: string;
  motivationLetter?: string;
  job?: Job;
  jobId: number;
  cvUrl: string;
  status: 'Pending' | 'Reviewed' | 'Hired' | 'Rejected';
}