import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {
  allDrivers: any[] = [];
  filteredDrivers: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  sortField: string = 'username';
  sortDirection: 'asc' | 'desc' = 'asc';
  userRole: string = 'admin'; // Replace with actual role logic (e.g., from auth service)
 isSearchingPhone = false;
  isSearchingEmail = false;
  searchName: string = '';
    searchPhone: string = '';
    searchEmail: string = '';
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  async loadDrivers(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.http.get<any[]>('https://www.fraiza.xyz/api/vtcchauffeur/').toPromise();
      this.allDrivers = response!;
      this.onSearch();
    } catch (error) {
      console.error('Error loading drivers:', error);
      this.showError('Erreur lors du chargement des chauffeurs');
    } finally {
      this.isLoading = false;
    }
  }
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
  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDrivers = this.allDrivers
      .filter(driver =>
        driver.etat === 'actif' && !driver.isBanned && // Only show active drivers in this tab
        (driver.username.toLowerCase().includes(term) ||
         driver.email.toLowerCase().includes(term) ||
         (driver.telephone && driver.telephone.includes(term)) ||
         driver.Ville.toLowerCase().includes(term))
      );
    this.sortDrivers(this.sortField);
  }

  sortDrivers(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredDrivers.sort((a, b) => {
      const aValue = a[field] || '';
      const bValue = b[field] || '';
      return this.sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }

  getSortIcon(field: string): string {
    if (this.sortField === field) {
      return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    }
    return 'fa-sort';
  }

  viewDriverDetails(id: string): void {
    this.router.navigate(['/chauffeur', id]);
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