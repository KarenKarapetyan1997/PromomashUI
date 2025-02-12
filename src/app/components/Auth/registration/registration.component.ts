import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { NgForOf, NgIf } from '@angular/common';
import { Country, Province, RegistrationData } from '../models/registration.model';
import {RouterLink,Router} from '@angular/router';


@Component({
  selector: 'app-registration',
  standalone: true,
  templateUrl: 'registration.component.html',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    RouterLink
  ],
  styleUrls: ['registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  step: number = 1;
  countries: Country[] = [];
  provinces: Province[] = [];

  constructor(private fb: FormBuilder, private registrationService: RegistrationService, private router: Router) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      login: ['', [Validators.required, Validators.email]],  // used for email
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d).+$')]],
      confirmPassword: ['', [Validators.required]],
      agree: [false, [Validators.requiredTrue]],
      country: ['', Validators.required],
      province: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.registrationService.getCountries().subscribe(data => {
      this.countries = data;
    });
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  nextStep(): void {
    ['login', 'password', 'confirmPassword', 'agree'].forEach(field => {
      this.registrationForm.get(field)?.markAsTouched();
    });
    if (
      this.registrationForm.get('login')?.valid &&
      this.registrationForm.get('password')?.valid &&
      this.registrationForm.get('confirmPassword')?.valid &&
      this.registrationForm.get('agree')?.valid &&
      !this.registrationForm.errors?.['notMatching']
    ) {
      this.step = 2;
    }
  }

  onCountryChange(event: any): void {
    const selectedCountryId = event.target.value;
    if (selectedCountryId) {
      const selectedCountry = this.countries.find(country => country.id === selectedCountryId);
      this.provinces = selectedCountry ? selectedCountry.provinces : [];
      this.registrationForm.get('province')?.setValue('');
    }
  }

  submit(): void {
    ['country', 'province'].forEach(field => {
      this.registrationForm.get(field)?.markAsTouched();
    });
    if (
      this.registrationForm.get('country')?.valid &&
      this.registrationForm.get('province')?.valid
    ) {
      const registrationData: RegistrationData = {
        email: this.registrationForm.value.login,
        password: this.registrationForm.value.password,
        confirmPassword: this.registrationForm.value.confirmPassword,
        countryId: this.registrationForm.value.country,
        provinceId: this.registrationForm.value.province
      };

      this.registrationService.saveRegistration(registrationData).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);

        },
        error: (error) => {
          console.error('Error saving registration:', error);

        }
      });
    }
  }
}
