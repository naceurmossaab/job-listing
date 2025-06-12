import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private message: NzMessageService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const errorMessage = err.error?.message || this.getDefaultMessage(err.status);

        this.message.error(errorMessage);
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private getDefaultMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Bad request';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Access forbidden';
      case 404:
        return 'Resource not found';
      case 409:
        return 'Conflict occurred';
      case 500:
      default:
        return 'Server error. Please try again later.';
    }
  }
}