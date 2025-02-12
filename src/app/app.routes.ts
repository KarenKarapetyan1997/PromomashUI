import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/Auth/registration/registration.component';
import { LoginComponent } from './components/Auth/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
