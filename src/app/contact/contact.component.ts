import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[\d\s-]{10,}$/)]], // Optional phone with basic validation
      message: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      try {
        // Map form fields to API schema
        const formData = {
          nom: this.contactForm.value.name,
          email: this.contactForm.value.email,
          numerotelephone: this.contactForm.value.phone || '', // Ensure empty string if phone is not provided
          message: this.contactForm.value.message,
          etat: 'En Attente' // Default status as per API schema
          // dateRecu is set by the backend (Date.now), so not included here
        };

        const response = await this.http.post('https://www.fraiza.xyz/api/reclamation/addreclamation', formData).toPromise();
        console.log('Server Response:', response);
        const modal = new bootstrap.Modal(document.getElementById('contactConfirmationModal')!);
        modal.show();
        this.contactForm.reset();
        this.contactForm.markAsPristine();
        this.contactForm.markAsUntouched();
      } catch (error) {
        console.error('Erreur:', error);
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('class', 'visually-hidden');
        liveRegion.textContent = `Erreur lors de l'envoi du message`;
        document.body.appendChild(liveRegion);
        setTimeout(() => liveRegion.remove(), 3000);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}