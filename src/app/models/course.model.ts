import { HistoryItem } from "./history-item.model";

export interface Course {
  id: string;
  client: {
    name: string;
    phone: string;
    pax: number;
    comment: string;
    email: string;
    preference: string;
  };
  details: {
    status: 'Immédiate' | 'Planifiée';
    type: 'Arrêté' | 'En cours' | 'Terminé';
    city: string;
    creationDate: Date;
    pickupDate: Date;
    returnDate?: Date;
    from: string;
    to: string;
    distance: number; // in Km
    estimatedDuration: number; // in minutes
    vehicle: string;
    progress: number; // Percentage (e.g., 75)
  };
  reference: {
    driver: string;
    company: string;
    paymentStatus: 'En attente' | 'Payée' | 'Échoué';
  };
  payment: {
    application: 'Payée' | 'Non payée';
    soc: 'Payée' | 'Non payée';
    paypal: string;
  };
  history: HistoryItem[];
}