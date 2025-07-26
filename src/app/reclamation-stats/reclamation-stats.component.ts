import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface StatItem {
  key: string;
  title: string;
  bgClass: string;
  iconClass: string;
  description: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-reclamation-stats',
  templateUrl: './reclamation-stats.component.html',
  styleUrls: ['./reclamation-stats.component.css']
})
export class ReclamationStatsComponent implements OnInit {
  stats: any = {};
  statItems: StatItem[] = [
    { key: 'enAttente', title: 'En Attente', bgClass: 'bg-en-attente', iconClass: 'fas fa-hourglass-half', description: 'Réclamations en attente', ariaLabel: 'Voir les réclamations en attente' },
    { key: 'enCours', title: 'En Cours', bgClass: 'bg-en-cours', iconClass: 'fas fa-spinner', description: 'Réclamations en cours', ariaLabel: 'Voir les réclamations en cours' },
    { key: 'resolue', title: 'Résolue', bgClass: 'bg-resolue', iconClass: 'fas fa-check-circle', description: 'Réclamations résolues', ariaLabel: 'Voir les réclamations résolues' },
    { key: 'rejetee', title: 'Rejetée', bgClass: 'bg-rejetee', iconClass: 'fas fa-ban', description: 'Réclamations rejetées', ariaLabel: 'Voir les réclamations rejetées' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
  }

  async loadStats(): Promise<void> {
    try {
      const data = await this.http.get('https://www.fraiza.xyz/api/reclamation/stats').toPromise();
      this.stats = data;
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      this.showError('Erreur lors du chargement des statistiques des réclamations');
    }
  }

  onCardClick(stat: StatItem): void {
    console.log(`Clicked on ${stat.title}`);
    // Add navigation or modal logic here, e.g., navigate to a detailed view
    // this.router.navigate([`/reclamations/${stat.key}`]);
  }

  showError(message: string): void {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('class', 'visually-hidden');
    liveRegion.textContent = message;
    document.body.appendChild(liveRegion);
    setTimeout(() => liveRegion.remove(), 3000);
  }
}