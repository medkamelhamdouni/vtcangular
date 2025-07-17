export interface Trip {
  id: string;
  from: string;
  destination: string;
  date: string; // Or Date, if you plan to convert it upon receipt
  telephone: string;
  prix: number;
  alleretour: boolean;
  dispatcherId?: string; // Optional property
  
  // You can add any other properties from your API here
  passengers?: number;
  comment?: string;
  status?: string;
  vehicle?: string;
  driver?: string;
  commission?: number;
  duration?: string;
  distance?: string;
}