import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function RoleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.authUser$.pipe(
      filter(user => user !== undefined),
      take(1),
      map(user => {
        if (!user || !allowedRoles.includes(user.role)) {
          router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  };
}
