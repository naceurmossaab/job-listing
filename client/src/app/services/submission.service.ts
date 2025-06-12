// src/app/submissions/submission.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ISubmission } from '../models/submission';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  private apiUrl = environment.apiUrl + 'submissions';

  constructor(private http: HttpClient) { }

  create(formData: FormData): Observable<ISubmission> {
    return this.http.post<ISubmission>(this.apiUrl, formData, { withCredentials: true });
  }

  check(jobId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/check?jobId=${jobId}`, { withCredentials: true });
  }

  getAll(): Observable<ISubmission[]> {
    return this.http.get<ISubmission[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<ISubmission> {
    return this.http.get<ISubmission>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
  
  getByEmployer(): Observable<ISubmission[]> {
    return this.http.get<ISubmission[]>(`${this.apiUrl}/employer`, { withCredentials: true });
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status }, { withCredentials: true });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
