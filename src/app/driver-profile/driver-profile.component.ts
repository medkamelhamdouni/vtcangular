import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

// To use Bootstrap's Tooltip JS, you might need to import it.
// Note: The recommended Angular way is to use a library like ng-bootstrap.
declare var bootstrap: any;

@Component({
  selector: 'app-driver-profile',
  standalone: true,
  imports: [CommonModule,NavbarComponent], // Use CommonModule for directives like *ngIf, *ngFor, etc.
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.css']
})
export class DriverProfileComponent implements AfterViewInit {

  // State for the active tab
  activeTab: string = 'info';

  // State for search button loading indicators
  isSearchingPhone = false;
  isSearchingEmail = false;

  // Driver data object
  driver = {
    name: 'Toumani Traore',
    initial: 'T',
    status: 'Inactif',
    city: 'Paris',
    break: 5,
    id: '6KTMT6VloS02eSQW7WyT',
    cb1: '9884',
    cb2: '-',
    mapImageUrl: 'https://i.imgur.com/3O1hBNo.png'
  };

  company = {
    siren: '-',
    name: 'Good Cab',
    iban: '-',
    vat: '-',
    address: '-'
  };

  vehicle = {
    year: 2024,
    model: 'Tesla',
    registration: 'GZ 182 ZA'
  };

  info = {
    totalRides: '-',
    birthDate: '09/02/1999',
    statusReason: '-'
  };

  appInfo = {
    registrationDate: '20/02/2025',
    lastOpened: '08/06/2025',
    currentPosition: '-'
  };

  constructor() { }

  /**
   * Initializes Bootstrap tooltips after the view has been rendered.
   * This is the correct lifecycle hook for DOM-dependent initializations.
   */
  ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  /**
   * Sets the active tab.
   * @param tabName The name of the tab to activate.
   */
  selectTab(tabName: string): void {
    this.activeTab = tabName;
  }

  /**
   * Simulates a search action for the phone number.
   */
  searchByPhone(): void {
    this.isSearchingPhone = true;
    setTimeout(() => {
      this.isSearchingPhone = false;
      // Add actual search logic here
    }, 1000);
  }

  /**
   * Simulates a search action for the email.
   */
  searchByEmail(): void {
    this.isSearchingEmail = true;
    setTimeout(() => {
      this.isSearchingEmail = false;
      // Add actual search logic here
    }, 1000);
  }
}