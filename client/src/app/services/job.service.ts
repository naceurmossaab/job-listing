import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Job, JobApiResponse } from "../models/job";
import { IStats } from "../models/stats";

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = environment.apiUrl + 'jobs';

  constructor(private http: HttpClient) { }

  getJobs(params?: { employerId?: number, title?: string; category?: string, page?: number, limit?: number }): Observable<JobApiResponse> {
    return this.http.get<JobApiResponse>(this.apiUrl, { params });
  }

  getOne(id: string) {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  getOneWithSubmissions(id: string) {
    return this.http.get<Job>(`${this.apiUrl}/employer/${id}?submission=true`, { withCredentials: true });
  }

  create(data: any) {
    return this.http.post(this.apiUrl, data, { withCredentials: true });
  }

  update(id: string, data: any) {
    return this.http.patch(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getStats() {
    return this.http.get<IStats>(`${this.apiUrl}/stats`, { withCredentials: true });
  }
}