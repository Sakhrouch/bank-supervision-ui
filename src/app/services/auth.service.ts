import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistrationRequest {
  name: string;
  email: string;
  password: string;
  roleType?: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  role: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/v1/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthenticationResponse> {
    console.log('[AuthService] login request', request);
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/login`, request).pipe(
      tap(res => console.log('[AuthService] login response', res))
    );
  }

  register(request: RegistrationRequest): Observable<AuthenticationResponse> {
    console.log('[AuthService] register request', request);
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/register`, request).pipe(
      tap(res => console.log('[AuthService] register response', res))
    );
  }

  refreshToken(request: RefreshRequest): Observable<AuthenticationResponse> {
    console.log('[AuthService] refreshToken request', request);
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/refresh`, request).pipe(
      tap(res => console.log('[AuthService] refreshToken response', res))
    );
  }

  saveAuth(response: AuthenticationResponse): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('token_type', response.token_type);
    localStorage.setItem('role', response.role);
    localStorage.setItem('name', response.name);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getName(): string | null {
    return localStorage.getItem('name');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
  }
}