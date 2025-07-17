import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  /**
   * Shows a notification.
   * In a real app, you would integrate a library like ngx-toastr
   * or a custom toast component.
   * @param message The message to display.
   */
  show(message: string): void {
    console.log(`[Notification]: ${message}`);
    // The simplest possible notification:
    alert(message);
  }
}