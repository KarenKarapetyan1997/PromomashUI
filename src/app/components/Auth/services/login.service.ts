import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {LoginModel} from '../models/login.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(model: LoginModel): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, model);
  }
}
