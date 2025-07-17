import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // 'of' is used to return mock data as an Observable
import { Course } from '../models/course.model';
import { HistoryItem } from '../models/history-item.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  // A private mock course object to simulate a database record.
  private mockCourse: Course = {
    id: 'persUxdgo8eeeys56iPb',
    client: {
      name: 'Inconnu',
      phone: '+33612345678',
      pax: 1,
      comment: 'Préférer un véhicule électrique',
      email: 'inconnu@example.com',
      preference: 'Siège bébé requis'
    },
    details: {
      status: 'Immédiate',
      type: 'En cours',
      city: 'Lyon',
      creationDate: new Date('2025-07-06T22:07:57Z'),
      pickupDate: new Date('2025-07-06T22:07:00Z'),
      from: '118 Rue Marietton, 69130 Écully, France',
      to: '28 Rue de la Bannière, 69003 Lyon, France',
      distance: 7,
      estimatedDuration: 15,
      vehicle: 'Tesla Model 3',
      progress: 75
    },
    reference: {
      driver: 'Toumani Traore',
      company: 'Good Cab',
      paymentStatus: 'En attente'
    },
    payment: {
      application: 'Non payée',
      soc: 'Non payée',
      paypal: '-'
    },
    history: [
      {
        timestamp: new Date('2025-07-06T22:09:44Z'),
        title: 'Stop course après 1m 39s',
        titleBadge: 'r113',
        titleBadgeClass: 'bg-success',
        details: 'Frais 12€10',
        statusBadge: 'en attente',
        statusBadgeClass: 'bg-warning'
      },
      {
        timestamp: new Date('2025-07-06T22:07:57Z'),
        title: 'Création',
        titleBadge: 'r113 envoyé',
        titleBadgeClass: 'bg-success',
        details: 'Frais 12€22',
        statusBadge: 'en attente',
        statusBadgeClass: 'bg-warning'
      },
      {
        timestamp: new Date('2025-07-06T21:45:12Z'),
        title: 'Assignation chauffeur',
        titleBadge: 'r113 assigné',
        titleBadgeClass: 'bg-info',
        details: 'Chauffeur: Toumani Traore',
        statusBadge: 'en cours',
        statusBadgeClass: 'bg-primary'
      },
      {
        timestamp: new Date('2025-07-06T20:30:25Z'),
        title: 'Demande de course',
        titleBadge: 'r112 soumis',
        titleBadgeClass: 'bg-secondary',
        details: 'Frais estimés 15€50',
        statusBadge: 'en attente',
        statusBadgeClass: 'bg-warning'
      }
    ]
  };

  constructor() { }

  /**
   * Simulates fetching a course by its ID.
   * In a real app, this would make an HTTP request to a server.
   * @param id The ID of the course to fetch.
   * @returns An Observable that emits the course data.
   */
  getCourseById(id: string): Observable<Course> {
    console.log(`CourseService: Pretending to fetch course with ID: ${id}`);
    // 'of()' creates an Observable that instantly returns the mock data.
    // We ignore the id for now since we only have one mock course.
    return of(this.mockCourse);
  }
}
