import { Component, OnInit } from '@angular/core';
import { TripService } from '../services/trip.service';

interface StatItem {
  key: string;
  title: string;
  bgClass: string;
  iconClass: string;
  description: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-card-information',
  templateUrl: './card-information.component.html',
  styleUrls: ['./card-information.component.css']
})
export class CardInformationComponent implements OnInit {
  stats: any = {};
  statItems: StatItem[] = [
    { key: 'devis', title: 'Devis', bgClass: 'bg-devis', iconClass: 'fas fa-file-invoice', description: 'Pending quotes', ariaLabel: 'View pending quotes' },
    { key: 'nonVendu', title: 'Non Vendu', bgClass: 'bg-non-vendu', iconClass: 'fas fa-times-circle', description: 'Unsold trips', ariaLabel: 'View unsold trips' },
    { key: 'enAttente', title: 'En Attente', bgClass: 'bg-en-attente', iconClass: 'fas fa-hourglass-half', description: 'Awaiting confirmation', ariaLabel: 'View trips awaiting confirmation' },
    { key: 'enCours', title: 'En Cours', bgClass: 'bg-en-cours', iconClass: 'fas fa-spinner', description: 'In progress', ariaLabel: 'View trips in progress' },
    { key: 'terminee', title: 'Terminée', bgClass: 'bg-terminee', iconClass: 'fas fa-check-circle', description: 'Completed trips', ariaLabel: 'View completed trips' },
    { key: 'annulee', title: 'Annulée', bgClass: 'bg-annulee', iconClass: 'fas fa-ban', description: 'Cancelled trips', ariaLabel: 'View cancelled trips' }
  ];

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.tripService.getTripStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Error fetching stats:', err);
      }
    });
  }

  onCardClick(stat: StatItem): void {
    console.log(`Clicked on ${stat.title}`);
    // Add navigation or modal logic here, e.g., navigate to a detailed view
    // this.router.navigate([`/details/${stat.key}`]);
  }
}