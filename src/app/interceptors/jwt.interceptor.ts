import {
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isInBlockedList(request.url)) {
      const token = this.apiService.token;
      if (token && token !== '') {
        request = this.addToken(request, token);
      }
    }
    return next.handle(request);
  }

  private isInBlockedList(url: string) {
    if (url.indexOf('/auth') >= 0 || url.indexOf('/refresh') >= 0) {
      return true;
    } else {
      return false;
    }
  }

  private addToken(req: HttpRequest<any>, token) {
    return req.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }
}
