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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.valid) {
      const submitBtn = document.querySelector('#contact-submit') as HTMLButtonElement;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi...';

      try {
        const response = await this.http.post('https://www.fraiza.xyz/api/contact', this.contactForm.value).toPromise();
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
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer';
      }
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}