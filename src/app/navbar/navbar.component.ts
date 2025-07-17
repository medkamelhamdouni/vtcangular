import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',  standalone: true,

  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
    username: string = '';
  
    constructor(private router: Router) {}
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.isLoggedIn = true;
      this.username = JSON.parse(user).username;
    } else {
      this.isLoggedIn = false;
    }
  }
 logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
