import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, from, of } from 'rxjs';

import jwtDecode from 'jwt-decode';

import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { isPlatform } from '@ionic/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

const TOKEN_KEY = 'access-token';
const REFRESH_TOKEN = 'refresh-token';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  token = '';
  userId = null;

  private authState: BehaviorSubject<boolean> = new BehaviorSubject(null);
  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token?.value) {
      this.token = token.value;
      const decoded: any = jwtDecode(this.token);
      this.userId = decoded.id;

      this.authState.next(true);
    } else {
      this.authState.next(false);
    }
  }

  signUp(credentials: { username; password }) {
    return this.http.post(`${environment.apiUrl}/users`, credentials).pipe(
      switchMap((result) => {
        return this.login(credentials);
      })
    );
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
      }),
      tap((_) => {
        this.authState.next(true);
      })
    );
  }

  async logout() {
    this.authState.next(false);
    this.userId = null;
    this.token = '';
    await Storage.remove({ key: TOKEN_KEY });
    await Storage.remove({ key: REFRESH_TOKEN });
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  isAuthenticated() {
    return this.authState.asObservable();
  }

  getSecretTest() {
    return this.http.get(`${environment.apiUrl}/users/secret`);
  }

  isRefreshTokenValid() {
    return from(Storage.get({ key: REFRESH_TOKEN })).pipe(
      map((token) => {
        if (!token.value) {
          return false;
        } else {
          const decoded: any = jwtDecode(token.value);
          const now = new Date().getTime();
          return now < decoded.exp * 1000;
        }
      })
    );
  }

  getNewAccessToken() {
    return from(Storage.get({ key: REFRESH_TOKEN })).pipe(
      switchMap((token) => {
        if (token) {
          const httpOptions = {
            headers: new HttpHeaders({
              Authorization: `Bearer ${token.value}`,
            }),
          };
          return this.http.get(
            `${environment.apiUrl}/auth/refresh`,
            httpOptions
          );
        } else {
          of(null);
        }
      })
    );
  }

  saveAccessToken(token) {
    this.token = token;
    return from(Storage.set({ key: REFRESH_TOKEN, value: token }));
  }

  getProfile() {
    return this.http.get(`${environment.apiUrl}/users/${this.userId}`);
  }

  updateProfile(data) {
    return this.http.put(`${environment.apiUrl}/users/${this.userId}`, data);
  }

  deleteAccount() {
    return this.http.delete(`${environment.apiUrl}/users/${this.userId}`);
  }

  async uploadAvatar(image: Photo) {
    let file = null;

    if (isPlatform('hybrid')) {
      const { data } = await Filesystem.readFile({
        path: image.path,
        directory: Directory.Documents,
      });

      file = await this.dataUrlToFile(data);
    } else {
      const blob = await fetch(image.webPath).then((res) => res.blob());
      file = new File([blob], 'myFile', { type: blob.type });
    }

    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post(`${environment.apiUrl}/users/${this.userId}/avatar`, formData)
      .toPromise();
  }

  private dataUrlToFile(
    dataUrl: string,
    fileName: string = 'myFile'
  ): Promise<File> {
    return fetch(`data:image/png;base64,${dataUrl}`)
      .then((res) => res.blob())
      .then((blob) => {
        return new File([blob], fileName, { type: 'image/png' });
      });
  }

  getUsers() {
    return this.http.get(`${environment.apiUrl}/users`);
  }

  getUserById(id) {
    return this.http.get(`${environment.apiUrl}/users/${id}`);
  }
}
