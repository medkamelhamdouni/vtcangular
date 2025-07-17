export interface HistoryItem {
  timestamp: Date;
  title: string;
  titleBadge: string;
  titleBadgeClass: 'bg-success' | 'bg-info' | 'bg-secondary';
  details: string;
  statusBadge: string;
  statusBadgeClass: 'bg-warning' | 'bg-primary' | 'bg-success' | 'text-dark';
}