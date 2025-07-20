// navbar.component.ts
import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Dropdown } from 'bootstrap'; // Import Bootstrap's Dropdown class

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string = '';
  isDarkTheme: boolean = false;
  isCollapsed: boolean = true;

  @ViewChild('toolsDropdown', { static: false }) toolsDropdown!: ElementRef;
  @ViewChild('userDropdown', { static: false }) userDropdown!: ElementRef;

  private dropdownInstances: Dropdown[] = [];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('dark-theme', this.isDarkTheme);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkAuthStatus();
      this.closeDropdown();
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap dropdowns
    if (this.toolsDropdown) {
      this.dropdownInstances.push(new Dropdown(this.toolsDropdown.nativeElement));
    }
    if (this.userDropdown) {
      this.dropdownInstances.push(new Dropdown(this.userDropdown.nativeElement));
    }
  }

  checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    this.isLoggedIn = !!(token && user);
    this.username = user ? JSON.parse(user).username : '';
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }

  toggleNavbar(): void {
    this.isCollapsed = !this.isCollapsed;
    if (!this.isCollapsed) {
      this.closeDropdown();
    }
  }

  preventDefault(event: Event): void {
    event.preventDefault(); // Prevent default anchor behavior for dropdown toggle
  }

  closeDropdown(): void {
    this.dropdownInstances.forEach(dropdown => dropdown.hide());
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.isCollapsed = true;
    this.closeDropdown();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    // Clean up dropdown instances
    this.dropdownInstances.forEach(dropdown => dropdown.dispose());
  }
}