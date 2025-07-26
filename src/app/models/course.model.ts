export interface TripLog {
  action: string;
  message: string;
  timestamp: string;
  userId?: string;
}

export interface Client {
  name: string;
  phone: string;
  pax: number;
  comment: string;
  email: string;
  preference: string;
}

export interface Details {
  city: string;
  progress: number;
  status: string;
  creationDate: string;
  from: string;
  to: string;
  distance: number;
  estimatedDuration: number;
  vehicle: string;
}

export interface Reference {
  driver: string;
  company: string;
  paymentStatus: string;
}

export interface Payment {
  amount: string;
  invoiceDate: string;
  application: string;
  soc: string;
  paypal: string;
}

export interface Course {
  _id: string;
  from: string;
  fromzip?: string;
  destination: string;
  destinationzip?: string;
  alleretour: boolean;
  nomclient?: string;
  date: string;
  telephone: string;
  telephonesec?: string;
  chauffeurId?: string;
  dispatcherId?: string;
  receptionisteId?: string;
  prixcourse?: string;
  feesapplication?: string;
  note?: string;
  commentaire?: string;
  typecourse?: 'Intermédiaire' | 'Immédiate' | 'Planifiée';
  etatcourse?: 'Devis' | 'Non Vendu' | 'En Attente' | 'En Cours' | 'Terminée' | 'Annulée';
  typepayment?: 'Espèces' | 'Carte bancaire' | 'PayPal' | 'Apple Pay';
  logs: TripLog[];
  createdAt: string;
  updatedAt: string;
  client: Client;
  details: Details;
  reference: Reference;
  payment: Payment;
  history: Array<{
    timestamp: string;
    title: string;
    details: string;
    titleBadge: string;
    titleBadgeClass: 'bg-success' | 'bg-info' | 'bg-secondary' | 'bg-warning' | 'bg-primary' | 'bg-danger';
    statusBadge: string;
    statusBadgeClass: 'bg-warning' | 'bg-primary' | 'bg-success' | 'bg-danger' | 'text-dark';
  }>;
}