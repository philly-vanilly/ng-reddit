import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return !!sessionStorage.getItem('access_token')
      && !!sessionStorage.getItem('access_token_expiration')
      && Date.parse(sessionStorage.getItem('access_token_expiration')) >= new Date().getTime();
  }
}
