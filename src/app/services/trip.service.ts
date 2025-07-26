// src/app/services/trip.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = 'https://www.fraiza.xyz/api/trip';

  constructor(private http: HttpClient) {}

  addTrip(tripData: any): Observable<any> {
    return this.http.post('https://www.fraiza.xyz/api/trip/addtrip', tripData);
  }
  getTripStats(): Observable<any> {
  return this.http.get('https://www.fraiza.xyz/api/trip/stats');
}

updateTrip(id: string, trip: Observable<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, trip);

  }
}
