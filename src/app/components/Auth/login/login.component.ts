import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import { NgIf } from '@angular/common';
import {LoginService} from '../services/login.service';
import {LoginModel} from '../models/login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, NgIf, RouterLink]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const loginModel: LoginModel = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.loginService.login(loginModel).subscribe({
      next: (response) => {
        const token = response.token;
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        console.error('Login error:');
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}
