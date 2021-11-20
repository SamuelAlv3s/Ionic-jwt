import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.apiService.isAuthenticated().pipe(
      filter((value) => value !== null),
      take(1),
      map((authenticated) => {
        if (authenticated) {
          return true;
        } else {
          return this.router.createUrlTree(['/']);
        }
      })
    );
  }
}
