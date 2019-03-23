import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const token = this.userService.getToken();
       if (token && token === 'true') {
         return true;
       } else {
         this.router.navigate(['']);
         return false;
       }
  }
}
