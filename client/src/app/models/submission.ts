import { Job } from "./job";

export interface ISubmission {
  fullName: string;
  email: string;
  motivationLetter?: string;
  job?: Job;
  jobId: number;
  cvUrl: string;
  status: 'Pending' | 'Reviewed' | 'Hired' | 'Rejected';
}