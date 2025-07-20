import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

declare var bootstrap: any;

@Component({
  selector: 'app-driver-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.css']
})
export class DriverProfileComponent implements AfterViewInit {
  activeTab: string = 'info';
  isSearchingPhone = false;
  isSearchingEmail = false;
  isUpdating = false;
  searchName: string = '';
  searchPhone: string = '';
  searchEmail: string = '';
  profileForm: FormGroup;

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

  courses = [
    { id: 1, date: '15/07/2025', start: 'Paris Centre', end: 'Aéroport CDG', distance: 25, fare: 45, status: 'Terminé' },
    { id: 2, date: '14/07/2025', start: 'Gare du Nord', end: 'Montmartre', distance: 5, fare: 15, status: 'Annulé' }
  ];

  documents = [
    { id: 1, name: 'Permis de conduire', status: 'Validé' },
    { id: 2, name: 'Carte grise', status: 'Expiré' },
    { id: 3, name: 'Assurance', status: 'Validé' }
  ];

  payments = [
    { id: 1, date: '15/07/2025', amount: 45, method: 'Carte bancaire', status: 'Payé' },
    { id: 2, date: '14/07/2025', amount: 15, method: 'Virement', status: 'En attente' }
  ];

  activityHistory = [
    { id: 1, action: 'Connexion', date: '15/07/2025 10:30', description: 'Connexion à l\'application' },
    { id: 2, action: 'Mise à jour profil', date: '14/07/2025 14:45', description: 'Mise à jour des informations de véhicule' }
  ];

  filteredCourses = [...this.courses];
  filteredDocuments = [...this.documents];
  filteredPayments = [...this.payments];
  filteredActivityHistory = [...this.activityHistory];

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: [this.driver.name, [Validators.required, Validators.minLength(2)]],
      city: [this.driver.city, [Validators.required]],
      status: [this.driver.status, [Validators.required]],
      cb1: [this.driver.cb1, [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  selectTab(tabName: string): void {
    this.activeTab = tabName;
    this.filterContent();
  }

  searchByPhone(): void {
    this.isSearchingPhone = true;
    setTimeout(() => {
      this.isSearchingPhone = false;
      this.filterContent();
    }, 1000);
  }

  searchByEmail(): void {
    this.isSearchingEmail = true;
    setTimeout(() => {
      this.isSearchingEmail = false;
      this.filterContent();
    }, 1000);
  }

  filterContent(): void {
    const searchText = (this.searchName + this.searchPhone + this.searchEmail).toLowerCase();
    this.filteredCourses = this.courses.filter(course =>
      course.start.toLowerCase().includes(searchText) ||
      course.end.toLowerCase().includes(searchText) ||
      course.status.toLowerCase().includes(searchText)
    );
    this.filteredDocuments = this.documents.filter(doc =>
      doc.name.toLowerCase().includes(searchText) ||
      doc.status.toLowerCase().includes(searchText)
    );
    this.filteredPayments = this.payments.filter(payment =>
      payment.method.toLowerCase().includes(searchText) ||
      payment.status.toLowerCase().includes(searchText)
    );
    this.filteredActivityHistory = this.activityHistory.filter(activity =>
      activity.action.toLowerCase().includes(searchText) ||
      activity.description.toLowerCase().includes(searchText)
    );
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
      modal.show();
    }
  }

  confirmUpdate(): void {
    this.isUpdating = true;
    setTimeout(() => {
      this.driver = { ...this.driver, ...this.profileForm.value };
      this.isUpdating = false;
      const modal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
      modal.hide();
      console.log('Profile updated:', this.driver);
    }, 1000);
  }

  viewDocument(docId: number): void {
    console.log('Viewing document:', docId);
  }

  viewInvoice(paymentId: number): void {
    console.log('Viewing invoice:', paymentId);
  }
}