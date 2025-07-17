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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // ✅ Redirect to home if session exists
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/home']);
    }
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
          if (res && res.token) {
            // ✅ Save session
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.router.navigate(['/home']); // ⬅️ Go to <app-home>
          } else {
            this.error = 'Unexpected error occurred.';
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Login failed.';
          this.loading = false;
        }
      });
  }
}
