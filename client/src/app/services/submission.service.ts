// src/app/submissions/submission.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Submission {
  id: number;
  fullName: string;
  email: string;
  motivationLetter?: string;
  cvUrl: string;
  jobId: number;
  status: 'Pending' | 'Reviewed' | 'Hired' | 'Rejected';
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  private apiUrl = environment.apiUrl + 'submissions';

  constructor(private http: HttpClient) { }

  create(formData: FormData): Observable<Submission> {
    return this.http.post<Submission>(this.apiUrl, formData, { withCredentials: true });
  }

  check(jobId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/check?jobId=${jobId}`, { withCredentials: true });
  }

  getAll(): Observable<Submission[]> {
    return this.http.get<Submission[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<Submission> {
    return this.http.get<Submission>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }


  updateStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status }, { withCredentials: true });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
