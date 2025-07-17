import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { Course } from '../models/course.model';
import { HistoryItem } from '../models/history-item.model';
import { CourseService } from '../services/course.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
  // Note: Removed ChangeDetectionStrategy.OnPush to simplify updates after data loading
})
export class CourseDetailComponent implements OnInit, AfterViewInit {
  // The component no longer takes an @Input() for the course.
  // It will fetch its own data.
  course: Course | undefined;
  isLoading = true; // To show a loading message

  @ViewChild('map') private mapContainer!: ElementRef;
  private map: any;

  // Mock data for dropdowns
  drivers = ['Toumani Traore', 'Amina Diallo', 'Jean Dupont'];
  companies = ['Good Cab', 'Fast Track'];

  // State for UI
  isHistorySidebarVisible = false;
  selectedDriver: string = '';
  sendSmsDriver: boolean = false;
  selectedCompany: string = '';
  sendSmsCompany: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef // To manually trigger change detection if needed
  ) {}

  ngOnInit(): void {
    // Get the 'id' from the URL, e.g., '/course/persUxdgo8eeeys56iPb'
    const courseId = this.route.snapshot.paramMap.get('id');

    if (courseId) {
      this.isLoading = true;
      this.courseService.getCourseById(courseId).subscribe(data => {
        this.course = data;
        this.isLoading = false;
        
        // Since data is loaded asynchronously, we might need to re-render
        this.cdr.detectChanges();

        // Initialize the map only after the course data is available
        if (this.mapContainer) {
          this.initMap();
        }
      });
    } else {
      console.error("CourseDetailComponent: No course ID found in the URL.");
      this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {
    // The map is now initialized in ngOnInit after data is loaded
    // to ensure 'this.course' is available for the popups.
  }

  private initMap(): void {
    // Ensure map is not already initialized
    if (this.map || !this.course) return;

    const startCoords: L.LatLngExpression = [45.7744, 4.8219]; // Écully approximation
    const endCoords: L.LatLngExpression = [45.7578, 4.8522]; // Lyon 3ème approximation

    this.map = L.map(this.mapContainer.nativeElement).setView(startCoords, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(this.map);

    L.marker(startCoords).addTo(this.map).bindPopup(`<b>Départ:</b> ${this.course.details.from}`);
    L.marker(endCoords).addTo(this.map).bindPopup(`<b>Arrivée:</b> ${this.course.details.to}`);
  }

  toggleHistorySidebar(): void {
    this.isHistorySidebarVisible = !this.isHistorySidebarVisible;
  }
  
  onHistoryItemClick(item: HistoryItem): void {
      this.notificationService.show(`Historique: ${item.title} - ${item.details}`);
  }

  stopCourse(): void {
    this.notificationService.show('La fonctionnalité "Stop Course" a été activée.');
  }

  copyDetails(): void {
    if (!this.course) return;
    const details = `Client: ${this.course.client.name}, Tél: ${this.course.client.phone}, De: ${this.course.details.from}, À: ${this.course.details.to}`;
    navigator.clipboard.writeText(details);
    this.notificationService.show('Détails de la course copiés.');
  }

  assignDriver(): void {
     if (!this.selectedDriver) {
        this.notificationService.show('Veuillez sélectionner un chauffeur.');
        return;
     }
     const smsMessage = this.sendSmsDriver ? ' et un SMS sera envoyé.' : '.';
     this.notificationService.show(`Course assignée à ${this.selectedDriver}${smsMessage}`);
  }
  
  assignCompany(): void {
      if (!this.selectedCompany) {
        this.notificationService.show('Veuillez sélectionner une société.');
        return;
     }
     const smsMessage = this.sendSmsCompany ? ' et un SMS sera envoyé.' : '.';
     this.notificationService.show(`Course assignée à ${this.selectedCompany}${smsMessage}`);
  }
}
