import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})

export class ReclamationComponent implements OnInit {
  @ViewChild('reclamationDetailsModal') reclamationDetailsModal: any;
  allReclamations: any[] = [];
  filteredReclamations: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  selectedReclamation: any = null;
  sortField: string = 'dateRecu';
  sortDirection: 'asc' | 'desc' = 'desc';
  userRole: string = 'receptioniste'; // Replace with actual role logic (e.g., from auth service)

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  async loadReclamations(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.http.get<any[]>('https://www.fraiza.xyz/api/reclamation/all').toPromise();
this.allReclamations = response!;

      this.onSearch();
    } catch (error) {
      console.error('Error loading reclamations:', error);
      this.showError('Erreur lors du chargement des réclamations');
    } finally {
      this.isLoading = false;
    }
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredReclamations = this.allReclamations
      .filter(reclamation =>
        reclamation.etat === 'En Attente' && // Only show En Attente in this tab
        (reclamation.nom.toLowerCase().includes(term) ||
         reclamation.email.toLowerCase().includes(term) ||
         (reclamation.numerotelephone && reclamation.numerotelephone.includes(term)) ||
         reclamation.message.toLowerCase().includes(term))
      );
    this.sortReclamations(this.sortField);
  }

  sortReclamations(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.filteredReclamations.sort((a, b) => {
      const aValue = a[field] || '';
      const bValue = b[field] || '';
      if (field === 'dateRecu') {
        return this.sortDirection === 'asc'
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }
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

  openModal(reclamation: any): void {
    this.selectedReclamation = reclamation;
    const modal = new bootstrap.Modal(this.reclamationDetailsModal.nativeElement);
    modal.show();
  }

  async updateReclamationStatus(id: string, etat: string): Promise<void> {
    try {
      const response = await this.http.patch(`https://www.fraiza.xyz/api/reclamation/${id}`, { etat }).toPromise();
      console.log('Reclamation updated:', response);
      this.loadReclamations(); // Refresh the list
      const modal = bootstrap.Modal.getInstance(this.reclamationDetailsModal.nativeElement);
      modal?.hide();
    } catch (error) {
      console.error('Error updating reclamation:', error);
      this.showError('Erreur lors de la mise à jour de la réclamation');
    }
  }

  async deleteReclamation(id: string): Promise<void> {
    if (confirm('Voulez-vous vraiment supprimer cette réclamation ?')) {
      try {
        await this.http.delete(`https://www.fraiza.xyz/api/reclamation/${id}`).toPromise();
        this.loadReclamations(); // Refresh the list
      } catch (error) {
        console.error('Error deleting reclamation:', error);
        this.showError('Erreur lors de la suppression de la réclamation');
      }
    }
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