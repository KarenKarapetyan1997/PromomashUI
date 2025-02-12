import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Country, RegistrationData} from '../models/registration.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get countries (each with its provinces) from the  API.
  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/countries`);
  }


  // Get provinces for a specific country from the  API.
  getProvinces(countryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/countries/${countryId}/provinces`);
  }

  saveRegistration(data: RegistrationData): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration`, data);
  }
}
