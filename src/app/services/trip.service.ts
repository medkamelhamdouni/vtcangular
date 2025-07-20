// src/app/services/trip.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private http: HttpClient) {}

  addTrip(tripData: any): Observable<any> {
    return this.http.post('https://www.fraiza.xyz/api/trip/addtrip', tripData);
  }
  getTripStats(): Observable<any> {
  return this.http.get('https://www.fraiza.xyz/api/trip/stats');
}
}
