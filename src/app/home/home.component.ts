import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Trip } from '../models/trip.model'; // Assuming you create a model for Trip
import { Router } from '@angular/router';

// This line is needed to use the global 'bootstrap' object from Bootstrap's JS
declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  // Properties for data management
  public allTrips: Trip[] = [];
  public filteredTrips: Trip[] = [];
  public selectedTrip: Trip | null = null;
  public isLoading = false;
  
  // Properties for UI state
  public searchTerm = '';
  private sortColumn = 'date';
  private sortDirection = 'asc';

  // ✅ Property to store the user's role
  public userRole: string | null = null;
  
  // Reference to the modal element in the template
  @ViewChild('courseDetailsModal') modalElement!: ElementRef;
  private courseModal: any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // ✅ Get the user's role from localStorage when the component initializes
    this.userRole = localStorage.getItem('role');
    this.fetchTrips();
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap modal once the view is ready
    this.courseModal = new bootstrap.Modal(this.modalElement.nativeElement);

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }
   viewDriverDetails(id: string): void {
    this.router.navigate(['/course', id]);
  }
  editDriverDetails(id: string): void {
    this.router.navigate(['/edit-course', id]);
  }
  paypage(id: string): void {
    this.router.navigate(['/pay', id]);
  }
  fetchTrips(): void {
    this.isLoading = true;
    this.http.get<Trip[]>('https://www.fraiza.xyz/api/trip/all').subscribe({
      next: (data) => {
        this.allTrips = data;
        this.applyFiltersAndSorting();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching trips:', err);
        this.isLoading = false;
      }
    });
  }

  applyFiltersAndSorting(): void {
    // 1. Filter
    let trips = this.allTrips.filter(trip => 
      (trip.from?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
      (trip.destination?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
      (trip.telephone?.toLowerCase() || '').includes(this.searchTerm.toLowerCase())
    );

    // 2. Sort
    trips.sort((a, b) => {
      const aValue = (a as any)[this.sortColumn] || '';
      const bValue = (b as any)[this.sortColumn] || '';
      
      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredTrips = trips;
  }

  onSearch(): void {
    // Use a slight delay to avoid triggering on every keystroke
    setTimeout(() => this.applyFiltersAndSorting(), 200);
  }
  
  sortTrips(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSorting();
  }
  
  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  openModal(trip: Trip): void {
    this.selectedTrip = trip;
    this.courseModal.show();
  }

  saveChanges(): void {
    if (this.selectedTrip) {
      console.log('Saving changes for trip:', this.selectedTrip);
      // Here you would typically call a service to update the trip on the server
      // e.g., this.tripService.update(this.selectedTrip).subscribe(...)
      this.courseModal.hide();
    }
  }
}
