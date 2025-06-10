import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { AuthUser } from '../models/auth';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + 'auth';
  private userSubject = new BehaviorSubject<AuthUser | undefined>(undefined);

  authUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.getLoggedInUser(token).subscribe();
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<AuthUser>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        this.userSubject.next(response);
      })
    );
  }

  register(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(undefined);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isUserLoggedIn() {
    const token = localStorage.getItem('token');
    if (token) this.getLoggedInUser(token).subscribe();
  }

  private getLoggedInUser(token: string): Observable<AuthUser | undefined> {
    return this.http
      .get<AuthUser>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(tap((user) => { this.userSubject.next(user) }),
        catchError((error) => {
          console.error('Failed to fetch logged-in user:', error);
          this.userSubject.next(undefined);
          localStorage.removeItem('token');
          return of(undefined);
        })
      );
  }
}
