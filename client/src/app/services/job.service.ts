import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { JobApiResponse } from "../models/job";

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = environment.apiUrl + 'jobs';

  constructor(private http: HttpClient) { }

  getJobs(params?: { title?: string; category?: string, page?: number, limit?: number }): Observable<JobApiResponse> {
    return this.http.get<JobApiResponse>(this.apiUrl, { params });
  }
}