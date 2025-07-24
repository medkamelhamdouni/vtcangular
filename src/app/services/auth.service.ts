// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, finalize } from 'rxjs';
import { environment } from '../../environments/environment'; // ✅ Best practice for API URLs

// ✅ Define an interface for the API response for type safety
export interface AuthResponse {
  token: string;
  user: any; // Define a proper User interface for better type safety
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/vtcuser/vtcuser/login`;

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Login logic is now encapsulated here
  login(credentials: { username: string, password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, credentials).pipe(
      tap(response => {
        // ✅ Save session data upon successful login
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  // ✅ Check if the user is currently authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ Centralized logout logic
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}