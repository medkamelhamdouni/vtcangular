import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { Course, TripLog } from '../models/course.model';
import { CourseService } from '../services/course.service';
import { NotificationService } from '../services/notification.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { SafePipe } from '../safe.pipe';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SafePipe],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})
export class CourseDetailComponent implements OnInit, AfterViewInit {
  course: Course | undefined;
  isLoading = true;
  isDownloading = false;
  showPreview = false;
  pdfPreviewUrl: string | null = null;
  pdfHeight: number = 500;
  isEditingAmount: boolean = false;
  editableAmount: string = '';
  @ViewChild('map') private mapContainer!: ElementRef;
  private map: any;

  activeTab: 'confirmation' | 'facture' = 'confirmation';
  drivers: string[] = [];
  isHistorySidebarVisible = false;
  selectedDriver: string = '';
  sendSmsDriver: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadDrivers();
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.isLoading = true;
      this.courseService.getCourseById(courseId).subscribe({
        next: (data: Course) => {
          this.course = {
            ...data,
            client: {
              name: data.nomclient || 'N/A',
              phone: data.telephone,
              pax: data.alleretour ? 2 : 1,
              comment: data.commentaire || '',
              email: '',
              preference: '',
            },
            details: {
              city: data.fromzip || 'Unknown',
              progress: data.etatcourse === 'En Cours' ? 50 : data.etatcourse === 'Terminée' ? 100 : 0,
              status: data.etatcourse || 'En Attente',
              creationDate: data.createdAt,
              from: data.from,
              to: data.destination,
              distance: 0,
              estimatedDuration: 0,
              vehicle: data.typecourse || 'N/A',
            },
            reference: {
              driver: data.chauffeurId || 'Non assigné',
              company: 'N/A',
              paymentStatus: data.typepayment ? 'Payée' : 'En attente',
            },
            payment: {
              amount: data.prixcourse || 'Non défini',
              invoiceDate: data.createdAt,
              application: data.feesapplication ? 'Payée' : 'Non payée',
              soc: 'Non payée',
              paypal: data.typepayment === 'PayPal' ? 'Payée' : 'N/A',
            },
            history: data.logs.map(log => {
              const { titleBadge, titleBadgeClass, statusBadge, statusBadgeClass } = this.getBadgeConfig(log.action);
              return {
                timestamp: log.timestamp,
                title: log.action,
                details: log.message,
                titleBadge,
                titleBadgeClass,
                statusBadge,
                statusBadgeClass,
              };
            }),
          };
          this.editableAmount = this.course.payment.amount || '';
          this.isLoading = false;
          this.cdr.detectChanges();
          if (this.mapContainer) {
            this.initMap();
          }
        },
        error: (error) => {
          console.error('Error fetching course:', error);
          this.isLoading = false;
          this.notificationService.show('Erreur lors du chargement des données de la course.');
        },
      });
    } else {
      console.error('CourseDetailComponent: No course ID found in the URL.');
      this.isLoading = false;
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

  ngAfterViewInit(): void {}

  private getBadgeConfig(action: string): {
    titleBadge: string;
    titleBadgeClass: 'bg-success' | 'bg-info' | 'bg-secondary' | 'bg-warning' | 'bg-primary' | 'bg-danger';
    statusBadge: string;
    statusBadgeClass: 'bg-warning' | 'bg-primary' | 'bg-success' | 'bg-danger' | 'text-dark';
  } {
    switch (action) {
      case 'Created':
        return {
          titleBadge: 'Créée',
          titleBadgeClass: 'bg-success',
          statusBadge: 'Initialisée',
          statusBadgeClass: 'bg-success',
        };
      case 'Updated':
        return {
          titleBadge: 'Mise à jour',
          titleBadgeClass: 'bg-info',
          statusBadge: 'Modifiée',
          statusBadgeClass: 'bg-primary',
        };
      case 'Assigned':
        return {
          titleBadge: 'Assignée',
          titleBadgeClass: 'bg-primary',
          statusBadge: 'Chauffeur Assigné',
          statusBadgeClass: 'bg-primary',
        };
      case 'Accepted':
        return {
          titleBadge: 'Acceptée',
          titleBadgeClass: 'bg-success',
          statusBadge: 'Confirmée',
          statusBadgeClass: 'bg-success',
        };
      case 'Started':
        return {
          titleBadge: 'Démarrée',
          titleBadgeClass: 'bg-info',
          statusBadge: 'En Cours',
          statusBadgeClass: 'bg-primary',
        };
      case 'Completed':
        return {
          titleBadge: 'Terminée',
          titleBadgeClass: 'bg-success',
          statusBadge: 'Achevée',
          statusBadgeClass: 'bg-success',
        };
      case 'Cancelled':
        return {
          titleBadge: 'Annulée',
          titleBadgeClass: 'bg-danger',
          statusBadge: 'Annulée',
          statusBadgeClass: 'bg-danger',
        };
      case 'Payment Pending':
        return {
          titleBadge: 'Paiement en Attente',
          titleBadgeClass: 'bg-warning',
          statusBadge: 'En Attente',
          statusBadgeClass: 'bg-warning',
        };
      case 'Payment Received':
        return {
          titleBadge: 'Paiement Reçu',
          titleBadgeClass: 'bg-success',
          statusBadge: 'Payée',
          statusBadgeClass: 'bg-success',
        };
      case 'No Show':
        return {
          titleBadge: 'Non Présenté',
          titleBadgeClass: 'bg-danger',
          statusBadge: 'Échoué',
          statusBadgeClass: 'bg-danger',
        };
      case 'System Update':
        return {
          titleBadge: 'Mise à jour Système',
          titleBadgeClass: 'bg-secondary',
          statusBadge: 'Système',
          statusBadgeClass: 'text-dark',
        };
      default:
        return {
          titleBadge: action,
          titleBadgeClass: 'bg-secondary',
          statusBadge: action,
          statusBadgeClass: 'text-dark',
        };
    }
  }

  private async initMap(): Promise<void> {
    if (this.map || !this.course) return;

    const geocodeAddress = async (address: string): Promise<L.LatLngExpression> => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        if (data.length > 0) {
          return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
      return [45.7744, 4.8219]; // Fallback coordinates
    };

    const startCoords = await geocodeAddress(this.course.details.from);
    const endCoords = await geocodeAddress(this.course.details.to);

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

  onHistoryItemClick(item: any): void {
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

  setActiveTab(tab: 'confirmation' | 'facture'): void {
    this.activeTab = tab;
  }

  get isPaymentOverdue(): boolean {
    if (!this.course || !this.course.payment.invoiceDate || this.course.reference.paymentStatus !== 'En attente') return false;
    const dueDate = new Date(this.course.payment.invoiceDate);
    dueDate.setDate(dueDate.getDate() + 30);
    return new Date() > dueDate;
  }

  toggleEditAmount(): void {
    this.isEditingAmount = !this.isEditingAmount;
    if (this.isEditingAmount) {
      this.editableAmount = this.course?.payment.amount || '';
    }
  }

  saveAmount(): void {
    if (this.course) {
      this.course.payment.amount = this.editableAmount;
      this.isEditingAmount = false;
      this.notificationService.show('Montant mis à jour.');
      this.cdr.detectChanges();
    }
  }

  copyInvoiceDetails(): void {
    if (!this.course) return;
    const details = `
      Facture #${this.course._id}
      Client: ${this.course.client.name}
      Email: ${this.course.client.email || 'Non spécifié'}
      Téléphone: ${this.course.client.phone}
      Date d'Émission: ${new Date(this.course.payment.invoiceDate).toLocaleDateString('fr-FR')}
      Montant: ${this.course.payment.amount || 'Non défini'}
      Statut: ${this.course.reference.paymentStatus}
    `.trim();
    navigator.clipboard.writeText(details);
    this.notificationService.show('Détails de la facture copiés.');
  }

  zoomIn(): void {
    this.pdfHeight += 100;
    this.cdr.detectChanges();
  }

  zoomOut(): void {
    if (this.pdfHeight > 200) {
      this.pdfHeight -= 100;
      this.cdr.detectChanges();
    }
  }

  generateInvoicePreview(): void {
    if (!this.course) return;
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 204);
    doc.text('Facture - EasyMove', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('EasyMove', 20, 35);
    doc.text('123 Rue de Lyon, 69003 Lyon, France', 20, 42);
    doc.text('Tél: +33 4 72 34 56 78', 20, 49);
    doc.text('Email: contact@easymove.fr', 20, 56);
    doc.text('SIRET: 123 456 789 00012', 20, 63);

    autoTable(doc, {
      startY: 75,
      head: [['Facture #', 'Date d\'Émission', 'Client', 'Email']],
      body: [[
        this.course._id,
        new Date(this.course.payment.invoiceDate).toLocaleDateString('fr-FR'),
        this.course.client.name,
        this.course.client.email || 'N/A',
      ]],
      theme: 'grid',
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 30 }, 2: { cellWidth: 60 }, 3: { cellWidth: 60 } },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Description', 'Détails']],
      body: [
        ['Trajet', `${this.course.details.from} à ${this.course.details.to}`],
        ['Ville', this.course.details.city],
        ['Distance', `${this.course.details.distance} Km`],
        ['Durée estimée', `${this.course.details.estimatedDuration} min`],
        ['Véhicule', this.course.details.vehicle],
        ['Nombre de passagers', `${this.course.client.pax}`],
        ['Commentaire', this.course.client.comment || 'Aucun'],
        ['Chauffeur', this.course.reference.driver || 'Non assigné'],
        ['Société', this.course.reference.company || 'N/A'],
        ['Statut', this.course.details.status],
        ['Type de course', this.course.typecourse || 'Non spécifié'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 120 } },
    });

    const amount = this.course.payment.amount || 'Non défini';
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Type de Paiement', 'Statut', 'Montant']],
      body: [
        ['Application', this.course.payment.application, ''],
        ['SOC', this.course.payment.soc, ''],
        ['Paypal', this.course.payment.paypal || 'N/A', ''],
        ['', 'Total', amount],
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60 },
        2: { cellWidth: 60, halign: 'right' },
      },
      didDrawCell: (data: any) => {
        if (data.section === 'body' && data.row.index === 3 && data.column.index === 2) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 102, 204);
        }
      },
    });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const termsY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Conditions de Paiement', 20, termsY);
    doc.text('• Paiement dû dans les 30 jours suivant la date d\'émission.', 20, termsY + 5);
    doc.text('• En cas de retard, une pénalité de 1.5% par mois peut être appliquée.', 20, termsY + 10);
    doc.text('• Contactez-nous pour toute question : contact@easymove.fr', 20, termsY + 15);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(0, 102, 204);
    doc.text('Merci de choisir EasyMove pour vos déplacements !', 105, termsY + 30, { align: 'center' });

    this.pdfPreviewUrl = doc.output('datauristring');
    this.showPreview = true;
    this.cdr.detectChanges();
  }

  downloadInvoice(): void {
    if (!this.course) return;
    this.isDownloading = true;
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 204);
    doc.text('Facture - EasyMove', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('EasyMove', 20, 35);
    doc.text('123 Rue de Lyon, 69003 Lyon, France', 20, 42);
    doc.text('Tél: +33 4 72 34 56 78', 20, 49);
    doc.text('Email: contact@easymove.fr', 20, 56);
    doc.text('SIRET: 123 456 789 00012', 20, 63);

    autoTable(doc, {
      startY: 75,
      head: [['Facture #', 'Date d\'Émission', 'Client', 'Email']],
      body: [[
        this.course._id,
        new Date(this.course.payment.invoiceDate).toLocaleDateString('fr-FR'),
        this.course.client.name,
        this.course.client.email || 'N/A',
      ]],
      theme: 'grid',
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 30 }, 2: { cellWidth: 60 }, 3: { cellWidth: 60 } },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Description', 'Détails']],
      body: [
        ['Trajet', `${this.course.details.from} à ${this.course.details.to}`],
        ['Ville', this.course.details.city],
        ['Distance', `${this.course.details.distance} Km`],
        ['Durée estimée', `${this.course.details.estimatedDuration} min`],
        ['Véhicule', this.course.details.vehicle],
        ['Nombre de passagers', `${this.course.client.pax}`],
        ['Commentaire', this.course.client.comment || 'Aucun'],
        ['Chauffeur', this.course.reference.driver || 'Non assigné'],
        ['Société', this.course.reference.company || 'N/A'],
        ['Statut', this.course.details.status],
        ['Type de course', this.course.typecourse || 'Non spécifié'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 120 } },
    });

    const amount = this.course.payment.amount || 'Non défini';
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Type de Paiement', 'Statut', 'Montant']],
      body: [
        ['Application', this.course.payment.application, ''],
        ['SOC', this.course.payment.soc, ''],
        ['Paypal', this.course.payment.paypal || 'N/A', ''],
        ['', 'Total', amount],
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60 },
        2: { cellWidth: 60, halign: 'right' },
      },
      didDrawCell: (data: any) => {
        if (data.section === 'body' && data.row.index === 3 && data.column.index === 2) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 102, 204);
        }
      },
    });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const termsY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Conditions de Paiement', 20, termsY);
    doc.text('• Paiement dû dans les 30 jours suivant la date d\'émission.', 20, termsY + 5);
    doc.text('• En cas de retard, une pénalité de 1.5% par mois peut être appliquée.', 20, termsY + 10);
    doc.text('• Contactez-nous pour toute question : contact@easymove.fr', 20, termsY + 15);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(0, 102, 204);
    doc.text('Merci de choisir EasyMove pour vos déplacements !', 105, termsY + 30, { align: 'center' });

    doc.save(`facture_${this.course._id}.pdf`);
    this.isDownloading = false;
    this.notificationService.show('Facture téléchargée.');
    this.cdr.detectChanges();
  }

  closePreview(): void {
    this.showPreview = false;
    this.pdfPreviewUrl = null;
    this.pdfHeight = 500;
  }
}