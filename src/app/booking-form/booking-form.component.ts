import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  // Define the form group
  bookingForm!: FormGroup;

  // Data for select dropdowns (can be fetched from an API)
  courseTypes = ['Intermédiaire', 'Immédiate', 'Planifiée'];
  missionTypes = ['Course M', 'Course S', 'Course L'];
  vehicleTypes = ['Tout type', 'Sedan', 'Van', 'Électrique'];
  passengerOptions = [1, 2, 3, 4];
  paymentMethods = ['Espèces', 'Carte bancaire', 'PayPal', 'Apple Pay'];
  tripTypes = ['A: Normal', 'B: Prioritaire', 'C: Économique'];
  drivers = ['Toumani Traore', 'Amina Diallo', 'Jean Dupont'];
  reasons = ['Urgence', 'Préférence client', 'Autre'];


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Initialize the form with FormBuilder
    this.bookingForm = this.fb.group({
      // Primary Action Row
      courseType: ['Intermédiaire'],
      missionType: ['Course M'],

      // Address Section
      departureAddress: ['118 Rue Marietton, 69130 Écully, France'],
      departurePostalCode: ['69130'],
      departureCountry: ['Paris'],
      arrivalAddress: ['28 Rue de la Bannière, 69003 Lyon, France'],
      arrivalPostalCode: ['69003'],

      // Client Info Section
      clientName: ['Jean Dupont'],
      primaryPhone: ['+33612345678'],
      secondaryPhone: ['+33698765432'],

      // Vehicle and Trip Details
      vehicleType: ['Tout type'],
      passengerCount: [1],
      roundTrip: [false],
      waitingTime: [''],
      handicapAccess: [false],
      babySeat: [false],

      // Payment and Comments
      paymentMethod: ['Espèces'],
      costGBP: [12.50],
      costEUR: [15.00],
      tripType: ['A: Normal'],
      comment: ['Préférer un véhicule électrique, siège bébé requis.'],

      // Action Buttons and Driver Assignment
      assignTo: [''],
      clientEmail: ['client@example.com'],
      internalNote: ['Confirmation SMS requise'],
      reason: [''],
    });
  }

  // Methods to handle form actions
  goDispatch(): void {
    console.log('Dispatch started!', this.bookingForm.value);
    // Add dispatch logic here
  }

  loadData(): void {
    console.log('Reloading data...');
    // Add API call to reload data here
    alert('Données rechargées !');
  }

  onSubmit(): void {
    // This is called when the form is submitted (e.g., "Envoyer" button)
    if (this.bookingForm.valid) {
      console.log('Form Submitted!', this.bookingForm.value);
      alert('Demande envoyée avec succès !');
      // Add logic to send data to the server
    } else {
      console.error('Form is invalid.');
    }
  }

  cancelTrip(): void {
    console.log('Trip cancelled.');
    alert('Course annulée !');
    this.bookingForm.reset(); // Optionally reset the form
  }
  
  // You can create similar methods for other buttons like:
  // sendQuote(), markAsNotSold(), assignDriver(), etc.
}