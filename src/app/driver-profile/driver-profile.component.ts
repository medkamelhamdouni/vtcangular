import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
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
  isLoading: boolean = false;
  isUpdating: boolean = false;
  driver: any = null;
  profileForm: FormGroup;

  // Placeholder data for unsupported tabs
  courses = [
    { id: 1, date: '15/07/2025', start: 'Paris Centre', end: 'Aéroport CDG', distance: 25, fare: 45, status: 'Terminé' },
    { id: 2, date: '14/07/2025', start: 'Gare du Nord', end: 'Montmartre', distance: 5, fare: 15, status: 'Annulé' }
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
  filteredPayments = [...this.payments];
  filteredActivityHistory = [...this.activityHistory];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      Ville: ['', [Validators.required]],
      etat: ['', [Validators.required]],
      telephone: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDriver(id);
    }
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  async loadDriver(id: string): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.http.get<any>(`https://www.fraiza.xyz/api/vtcchauffeur/${id}`).toPromise();
      this.driver = {
        ...response,
        initial: response.username ? response.username.charAt(0).toUpperCase() : 'N/A'
      };
      this.profileForm.patchValue({
        username: this.driver.username,
        Ville: this.driver.Ville,
        etat: this.driver.etat,
        telephone: this.driver.telephone
      });
    } catch (error) {
      console.error('Error loading driver:', error);
      this.showError('Erreur lors du chargement du chauffeur');
    } finally {
      this.isLoading = false;
    }
  }

  selectTab(tabName: string): void {
    this.activeTab = tabName;
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
      modal.show();
    }
  }

  async confirmUpdate(): Promise<void> {
    if (this.profileForm.valid) {
      this.isUpdating = true;
      try {
        const updatedData = this.profileForm.value;
        await this.http.patch(`https://www.fraiza.xyz/api/vtcchauffeur/${this.driver._id}`, updatedData).toPromise();
        this.driver = { ...this.driver, ...updatedData };
        console.log('Profile updated:', this.driver);
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
        modal.hide();
      } catch (error) {
        console.error('Error updating driver:', error);
        this.showError('Erreur lors de la mise à jour du profil');
      } finally {
        this.isUpdating = false;
      }
    }
  }

  viewDocument(docId: string): void {
    console.log('Viewing document:', docId);
    // Navigate to document URL or implement download logic
  }

  viewInvoice(paymentId: number): void {
    console.log('Viewing invoice:', paymentId);
    // Implement invoice viewing logic
  }

  showError(message: string): void {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('class', 'visually-hidden');
    liveRegion.textContent = message;
    document.body.appendChild(liveRegion);
    setTimeout(() => liveRegion.remove(), 3000);
  }
}