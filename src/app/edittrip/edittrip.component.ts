import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Trip } from '../models/trip.model'; // Make sure the path is correct

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edittrip.component.html',
  styleUrls: ['./edittrip.component.css']
})
export class EditTripComponent implements OnInit {
  
  // The main form group for our trip data
  tripForm: FormGroup;
  
  // State management properties
  tripId: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    // Initialize the form structure with validators
    this.tripForm = this.fb.group({
      id: [''], // ID is usually not editable but good to have in the form model
      from: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('^\\+?[0-9\\s-]+$')]],
      prix: [0, [Validators.required, Validators.min(0)]],
      alleretour: [false],
      dispatcherId: [''],
      comment: ['']
    });
  }

 // in edit-trip.component.ts

ngOnInit(): void {
  // Get the 'id' from the URL parameters
  this.tripId = this.route.snapshot.paramMap.get('id');
  
  if (this.tripId) {
    this.loadTripData(this.tripId);
  } else {
    // Handle the case where no ID is in the URL
    this.errorMessage = "Error: No trip ID found in the URL.";
    console.error("Trip ID is null or undefined.");
  }
}
  // Fetches trip data from the API and populates the form
  loadTripData(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    // IMPORTANT: Replace with your actual API endpoint
    this.http.get<Trip>(`https://www.fraiza.xyz/api/trip/${id}`).subscribe({
      next: (tripData) => {
        this.tripForm.patchValue(tripData); // Populates the form with fetched data
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Failed to load trip data. Error: ${err.message}`;
        this.isLoading = false;
      }
    });
  }

  // Handles the form submission
  onSubmit(): void {
    if (this.tripForm.invalid) {
      // Mark all fields as touched to display validation errors
      this.tripForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;

    // IMPORTANT: Replace with your actual API endpoint for updating
    this.http.put(`https://www.fraiza.xyz/api/trip/${this.tripId}`, this.tripForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        // On success, navigate back to the home/dashboard page
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = `Failed to update trip. Error: ${err.message}`;
        this.isLoading = false;
      }
    });
  }
  
  // Optional: A helper getter for easier access to form controls in the template
  get f() {
    return this.tripForm.controls;
  }
}