import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IUser } from "../models/user";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl + 'users';

  constructor(private http: HttpClient) { }

  create(formData: FormData): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, formData, { withCredentials: true });
  }

  getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl, { withCredentials: true });
  }

  getOne(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  update(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}