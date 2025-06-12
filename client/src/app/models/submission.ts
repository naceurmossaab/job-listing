export interface ISubmission {
  fullName: string;
  email: string;
  motivationLetter?: string;
  jobId: number;
  cvUrl: string;
  status: 'Pending' | 'Reviewed' | 'Hired' | 'Rejected';
}