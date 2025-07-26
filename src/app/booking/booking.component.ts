import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import * as bootstrap from 'bootstrap';

declare var intlTelInput: any;

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, AfterViewInit {
  @ViewChild('phoneInput') phoneInput!: ElementRef;
  @ViewChild('phoneInputRound') phoneInputRound!: ElementRef;
  @ViewChild('oneWaySubmitBtn') oneWaySubmitBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('roundTripSubmitBtn') roundTripSubmitBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('mainContent') mainContent!: ElementRef<HTMLElement>;

  oneWayForm!: FormGroup;
  roundTripForm!: FormGroup;
  addresses: string[] = [
    'Grand-Place, Bruxelles',
    'Aéroport de Bruxelles, Zaventem',
    'Gare du Midi, Bruxelles',
    'Atomium, Bruxelles',
    'Place Flagey, Ixelles',
    'Avenue Louise, Bruxelles',
    'Parc du Cinquantenaire, Bruxelles'
  ];
  fromSuggestions: string[] = [];
  destinationSuggestions: string[] = [];
  fromRoundSuggestions: string[] = [];
  destinationRoundSuggestions: string[] = [];
  itiInstances: { [key: string]: any } = {};

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.oneWayForm = this.fb.group({
      from: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['2025-07-15T21:32', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('[0-9\\s]{8,12}')]]
    });

    this.roundTripForm = this.fb.group({
      from: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['2025-07-15T21:32', Validators.required],
      returnDate: ['2025-07-16T21:32', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('[0-9\\s]{8,12}')]]
    });

    this.setupAutocomplete(this.oneWayForm, 'from', (suggestions) => this.fromSuggestions = suggestions);
    this.setupAutocomplete(this.oneWayForm, 'destination', (suggestions) => this.destinationSuggestions = suggestions);
    this.setupAutocomplete(this.roundTripForm, 'from', (suggestions) => this.fromRoundSuggestions = suggestions);
    this.setupAutocomplete(this.roundTripForm, 'destination', (suggestions) => this.destinationRoundSuggestions = suggestions);
  }

  ngAfterViewInit(): void {
    this.initializePhoneInputs();
    this.initializeTooltips();
    this.setupScrollListener();
  }

  initializePhoneInputs(): void {
    const phoneInputs = [
      { id: 'telephone', element: this.phoneInput },
      { id: 'telephone-round', element: this.phoneInputRound }
    ];

    phoneInputs.forEach(input => {
      if (input.element) {
        const iti = intlTelInput(input.element.nativeElement, {
          initialCountry: 'be',
          preferredCountries: ['be', 'fr', 'nl'],
          separateDialCode: true,
          utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js'
        });
        this.itiInstances[input.id] = iti;

        input.element.nativeElement.addEventListener('blur', () => {
          const valid = iti.isValidNumber();
          const control = input.id === 'telephone' ? this.oneWayForm.get('telephone') : this.roundTripForm.get('telephone');
          if (!valid) {
            control?.setErrors({ invalidNumber: true });
          } else {
            control?.setErrors(null);
          }
        });
      }
    });
  }

  initializeTooltips(): void {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  setupScrollListener(): void {
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
      }
    });
  }

  setupAutocomplete(form: FormGroup, controlName: string, setSuggestions: (suggestions: string[]) => void): void {
    const control = form.get(controlName);
    if (control) {
      control.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map(query => query || '')
      ).subscribe(query => {
        if (query && query.length >= 2) {
          setSuggestions(this.addresses.filter(addr => addr.toLowerCase().includes(query.toLowerCase())));
        } else {
          setSuggestions([]);
        }
      });
    }
  }

  selectSuggestion(controlName: string, suggestion: string, form: FormGroup): void {
    const actualControlName = controlName === 'from-round' ? 'from' : controlName === 'destination-round' ? 'destination' : controlName;
    form.get(actualControlName)?.setValue(suggestion);
    if (controlName === 'from') {
      this.fromSuggestions = [];
    } else if (controlName === 'destination') {
      this.destinationSuggestions = [];
    } else if (controlName === 'from-round') {
      this.fromRoundSuggestions = [];
    } else if (controlName === 'destination-round') {
      this.destinationRoundSuggestions = [];
    }
  }

  async onSubmit(form: FormGroup, formId: string): Promise<void> {
    const submitBtn = formId === 'one-way-form' ? this.oneWaySubmitBtn?.nativeElement : this.roundTripSubmitBtn?.nativeElement;
    const phoneControl = form.get('telephone');
    const iti = this.itiInstances[formId === 'one-way-form' ? 'telephone' : 'telephone-round'];

    if (form.valid && iti.isValidNumber()) {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi...';
      }

      const data = {
        from: form.value.from,
        destination: form.value.destination,
        date: form.value.date || form.value.departureDate,
        alleretour: formId === 'round-trip-form',
        telephone: iti.getNumber(),
        returnDate: form.value.returnDate || null
      };

      try {
        const response = await this.http.post('https://www.fraiza.xyz/api/trip/addtrip', data).toPromise();
        console.log('Server Response:', response);

        const modalElement = document.getElementById('confirmationModal')!;
        modalElement.setAttribute('aria-hidden', 'false');
        const modal = new bootstrap.Modal(modalElement);

        if (this.mainContent) {
          this.mainContent.nativeElement.setAttribute('inert', '');
        }

        modalElement.addEventListener('hidden.bs.modal', () => {
          if (this.mainContent) {
            this.mainContent.nativeElement.removeAttribute('inert');
          }
        }, { once: true });

        modal.show();
        form.reset();
        form.markAsPristine();
        form.markAsUntouched();

        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('class', 'visually-hidden');
        liveRegion.textContent = '🚖 Course envoyée avec succès ! Nous reviendrons vers vous dans quelques secondes pour confirmation.';
        document.body.appendChild(liveRegion);
        setTimeout(() => liveRegion.remove(), 3000);
      } catch (error) {
        console.error('Erreur:', error);
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('class', 'visually-hidden');
        liveRegion.textContent = `Erreur lors de l'envoi de la réservation`;
        document.body.appendChild(liveRegion);
        setTimeout(() => liveRegion.remove(), 3000);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Commander';
        }
      }
    } else {
      form.markAllAsTouched();
      if (!iti.isValidNumber()) {
        phoneControl?.setErrors({ invalidNumber: true });
      }
    }
  }
}