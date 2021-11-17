import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

import jwtDecode from 'jwt-decode';

import { Storage } from '@capacitor/storage';

const TOKEN_KEY = 'access-token';
const REFRESH_TOKEN = 'refresh-token';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  token = '';
  userId = null;
  constructor(private http: HttpClient) {}

  signUp(credentials: { username; password }) {
    return this.http.post(`${environment.apiUrl}/users`, credentials);
  }

  login(credentials: { username; password }) {
    return this.http.post(`${environment.apiUrl}/auth`, credentials).pipe(
      switchMap((data: any) => {
        console.log(data);
        this.token = data.accessToken;
        const decoded: any = jwtDecode(this.token);
        console.log('decoded: ', decoded);
        this.userId = decoded.id;

        const storedTokens = Promise.all([
          Storage.set({ key: TOKEN_KEY, value: this.token }),
          Storage.set({ key: REFRESH_TOKEN, value: data.refreshToken }),
        ]);
        return from(storedTokens);
      })
    );
  }
}
