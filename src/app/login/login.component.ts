import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;
  
  // Property for password visibility
  passwordVisible: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Redirect to home if a session already exists
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/admin']);
    }
  }

  // Method to toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.error = 'Username and password are required.';
      return;
    }

    this.loading = true;
    this.error = '';

    const payload = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>('https://www.fraiza.xyz/api/vtcuser/vtcuser/login', payload)
      .subscribe({
        next: (res) => {
          // Check for a valid response with token, user object, and role
          if (res && res.token && res.user && res.user.role) {
            // Save session data to localStorage
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            // ✅ Store the user's role
            localStorage.setItem('role', res.user.role);
            
            this.router.navigate(['/admin']); // Navigate to the admin page
          } else {
            // Handle cases where the response is missing expected data
            this.error = 'Login successful, but user data is incomplete.';
          }
          this.loading = false;
        },
        error: (err) => {
          // Handle login errors from the backend
          this.error = err.error?.message || 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      });
  }
}
