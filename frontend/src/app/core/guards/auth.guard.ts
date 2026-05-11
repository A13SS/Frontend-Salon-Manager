import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  //Roles requeridos definidos en la ruta
  const requiredRoles = route.data['roles'] as string[];

  // i no hay usuario o no tiene el rol necesario, redirige al login
  if (!user || !requiredRoles.includes(user.rol)) {
    console.warn(`Acceso denegado: Se requiere rol ${requiredRoles}`);
    return router.parseUrl('/login');
  }

  return true;
};
