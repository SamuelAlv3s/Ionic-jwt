import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  signUp(credentials: { username; password }) {
    return this.http.post(`${environment.apiUrl}/users`, credentials);
  }
}
