import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TripService } from '../services/trip.service'; // 👈 Import the service
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;

  // Example dropdowns
  courseTypes = ['Intermédiaire', 'Immédiate', 'Planifiée'];
  paymentMethods = ['Espèces', 'Carte bancaire', 'PayPal', 'Apple Pay'];
  drivers = ['Toumani Traore', 'Amina Diallo', 'Jean Dupont'];

  constructor(private fb: FormBuilder, private tripService: TripService , private router: Router 
) {} // 👈 Inject the service

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      courseType: ['Intermédiaire'],
      departureAddress: [''],
      departurePostalCode: [''],
      departureCountry: [''],
      arrivalAddress: [''],
      arrivalPostalCode: [''],
      roundTrip: [false],
      clientName: [''],
      primaryPhone: [''],
      secondaryPhone: [''],
      paymentMethod: ['Espèces'],
      costEUR: [0],
      internalNote: [''],
      comment: [''],
      assignTo: ['']
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const form = this.bookingForm.value;

      const payload = {
        from: form.departureAddress,
        fromzip: form.departurePostalCode,
        destination: form.arrivalAddress,
        destinationzip: form.arrivalPostalCode,
        alleretour: form.roundTrip,
        nomclient: form.clientName,
        date: new Date(), // Or use a date picker field
        telephone: form.primaryPhone,
        telephonesec: form.secondaryPhone,
        chauffeurId: form.assignTo || '',
        dispatcherId: '',
        receptionisteId: '',
        prix: form.costEUR.toString(),
        note: form.internalNote,
        commentaire: form.comment,
        typecourse: form.courseType,
        typepayment: form.paymentMethod
      };

      this.tripService.addTrip(payload).subscribe({
  next: (res) => {
    console.log('Trip created successfully', res);
    alert('Course ajoutée avec succès !');
    this.bookingForm.reset();

    this.router.navigate(['/admin']); // ✅ Redirect to /admin
  },
  error: (err) => {
    console.error('Erreur:', err);
    alert('Erreur lors de l\'envoi.');
  }
});

    } else {
      alert('Formulaire invalide');
    }
  }
}
