import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { NotificationService } from '../services/notification.service';
import { Course } from '../models/course.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css'],
})
export class EditCourseComponent implements OnInit {
  editForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  courseTypes = ['Intermédiaire', 'Immédiate', 'Planifiée'];
  courseStatuses = ['Devis', 'Non Vendu', 'En Attente', 'En Cours', 'Terminée', 'Annulée'];
  paymentMethods = ['Espèces', 'Carte bancaire', 'PayPal', 'Apple Pay'];
  drivers: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tripService: CourseService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDrivers();
    const tripId = this.route.snapshot.paramMap.get('id');
    if (tripId) {
      this.fetchTripData(tripId);
    } else {
      this.errorMessage = 'Aucun ID de course fourni.';
    }
  }

  private async loadDrivers(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.http.get<any[]>('https://www.fraiza.xyz/api/vtcchauffeur/').toPromise();
      this.drivers = response!.map(driver => driver.username);
    } catch (error) {
      console.error('Error loading drivers:', error);
      this.notificationService.show('Erreur lors du chargement des chauffeurs');
      this.drivers = []; // Fallback to empty array on error
    } finally {
      this.isLoading = false;
    }
  }

  private initializeForm(): void {
    this.editForm = this.fb.group({
      _id: [''],
      courseType: ['', Validators.required],
      courseStatus: ['', Validators.required],
      date: ['', Validators.required],
      departureAddress: ['', Validators.required],
      departurePostalCode: [''],
      departureCountry: [''],
      arrivalAddress: ['', Validators.required],
      arrivalPostalCode: [''],
      roundTrip: [false],
      clientName: [''],
      primaryPhone: ['', Validators.required],
      secondaryPhone: [''],
      clientEmail: [''],
      clientPax: [''],
      clientPreference: [''],
      paymentMethod: [''],
      costEUR: [''],
      applicationFees: [''],
      paymentStatus: [''],
      paymentApplication: [''],
      paymentSoc: [''],
      paymentPaypal: [''],
      internalNote: [''],
      comment: [''],
      assignTo: [''],
      dispatcherId: [''],
      receptionisteId: [''],
      company: [''],
      vehicle: [''],
    });
  }

  private fetchTripData(tripId: string): void {
    this.isLoading = true;
    this.tripService.getCourseById(tripId).subscribe({
      next: (data: Course) => {
        this.editForm.patchValue({
          _id: data._id,
          courseType: data.typecourse || 'Intermédiaire',
          courseStatus: data.etatcourse || 'En Attente',
          date: data.date || new Date(),
          departureAddress: data.from,
          departurePostalCode: data.fromzip || '',
          departureCountry: '',
          arrivalAddress: data.destination,
          arrivalPostalCode: data.destinationzip || '',
          roundTrip: data.alleretour || false,
          clientName: data.nomclient || data.client?.name || '',
          primaryPhone: data.telephone || data.client?.phone || '',
          secondaryPhone: data.telephonesec || '',
          clientEmail: data.client?.email || '',
          clientPax: data.client?.pax || 1,
          clientPreference: data.client?.preference || '',
          paymentMethod: data.typepayment || '',
          costEUR: data.prixcourse || data.payment?.amount || '',
          applicationFees: data.feesapplication || '',
          paymentStatus: data.reference?.paymentStatus || '',
          paymentApplication: data.payment?.application || 'Non payée',
          paymentSoc: data.payment?.soc || 'Non payée',
          paymentPaypal: data.payment?.paypal || 'N/A',
          internalNote: data.note || '',
          comment: data.commentaire || data.client?.comment || '',
          assignTo: data.chauffeurId || data.reference?.driver || '',
          dispatcherId: data.dispatcherId || '',
          receptionisteId: data.receptionisteId || '',
          company: data.reference?.company || '',
          vehicle: data.details?.vehicle || '',
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données:', err);
        this.errorMessage = 'Erreur lors du chargement des données de la course.';
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.isLoading = true;
      const form = this.editForm.value;

      const payload: Partial<Course> = {
        from: form.departureAddress,
        fromzip: form.departurePostalCode,
        destination: form.arrivalAddress,
        destinationzip: form.arrivalPostalCode,
        alleretour: form.roundTrip,
        nomclient: form.clientName,
        date: new Date(form.date).toISOString(),
        telephone: form.primaryPhone,
        telephonesec: form.secondaryPhone,
        chauffeurId: form.assignTo || '',
        dispatcherId: form.dispatcherId || '',
        receptionisteId: form.receptionisteId || '',
        prixcourse: form.costEUR?.toString(),
        feesapplication: form.applicationFees?.toString(),
        note: form.internalNote,
        commentaire: form.comment,
        typecourse: form.courseType,
        etatcourse: form.courseStatus,
        typepayment: form.paymentMethod,
        client: {
          name: form.clientName,
          phone: form.primaryPhone,
          pax: form.clientPax || 1,
          comment: form.comment,
          email: form.clientEmail,
          preference: form.clientPreference,
        },
        details: {
          city: form.departureCountry || form.departurePostalCode || '',
          progress: form.courseStatus === 'En Cours' ? 50 : form.courseStatus === 'Terminée' ? 100 : 0,
          status: form.courseStatus,
          creationDate: new Date().toISOString(),
          from: form.departureAddress,
          to: form.arrivalAddress,
          distance: 0, // Placeholder; update if API provides distance
          estimatedDuration: 0, // Placeholder; update if API provides duration
          vehicle: form.vehicle,
        },
        reference: {
          driver: form.assignTo || '',
          company: form.company || '',
          paymentStatus: form.paymentStatus || 'En attente',
        },
        payment: {
          amount: form.costEUR?.toString(),
          invoiceDate: new Date().toISOString(),
          application: form.paymentApplication,
          soc: form.paymentSoc,
          paypal: form.paymentPaypal,
        },
        logs: form._id ? [{
          action: 'Updated',
          message: 'Trip details updated via edit form',
          timestamp: new Date().toISOString(),
        }] : [],
      };

      this.tripService.updateTrip(form._id, payload).subscribe({
        next: (res) => {
          this.notificationService.show('Course mise à jour avec succès !');
          this.isLoading = false;
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          this.notificationService.show('Erreur lors de la mise à jour de la course.');
          this.isLoading = false;
        },
      });
    } else {
      this.notificationService.show('Formulaire invalide. Veuillez vérifier les champs.');
    }
  }

  assignDriver(): void {
    const driver = this.editForm.get('assignTo')?.value;
    if (driver) {
      this.notificationService.show(`Course assignée à ${driver}.`);
      const payload = {
        chauffeurId: driver,
        logs: [{
          action: 'Assigned',
          message: `Driver ${driver} assigned to trip`,
          timestamp: new Date().toISOString(),
        }],
      };
      this.tripService.updateTrip(this.editForm.value._id, payload).subscribe({
        next: () => {
          this.notificationService.show('Course mise à jour avec succès !');
          this.isLoading = false;
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Erreur lors de l\'assignation:', err);
          this.notificationService.show('Erreur lors de l\'assignation du chauffeur.');
          this.isLoading = false;
        },
      });
    } else {
      this.notificationService.show('Veuillez sélectionner un chauffeur.');
    }
  }

  cancel(): void {
    this.router.navigate(['/admin']);
  }
}