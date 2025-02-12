import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate the email field', () => {
    const email = component.loginForm.controls['email'];
    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();

    email.setValue('invalid-email');
    expect(email.hasError('email')).toBeTruthy();

    email.setValue('test@example.com');
    expect(email.valid).toBeTruthy();
  });

  it('should validate the password field', () => {
    const password = component.loginForm.controls['password'];
    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();

    password.setValue('password123');
    expect(password.valid).toBeTruthy();
  });

  it('should send login request and store token in sessionStorage if rememberMe is false', () => {
    spyOn(sessionStorage, 'setItem');
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    component.loginForm.controls['rememberMe'].setValue(false);

    component.onSubmit();

    const req = httpTestingController.expectOne('/login');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password123' });
    req.flush({ token: 'dummy-token' });

    expect(sessionStorage.setItem).toHaveBeenCalledWith('token', 'dummy-token');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should send login request and store token in localStorage if rememberMe is true', () => {
    spyOn(localStorage, 'setItem');
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    component.loginForm.controls['rememberMe'].setValue(true);

    component.onSubmit();

    const req = httpTestingController.expectOne('/login');
    expect(req.request.method).toEqual('POST');
    req.flush({ token: 'dummy-token' });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'dummy-token');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should display an error message when login fails', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    component.loginForm.controls['rememberMe'].setValue(false);

    component.onSubmit();

    const req = httpTestingController.expectOne('/login');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    // Update expected string to match component's error assignment.
    expect(component.errorMessage).toBe('Invalid email or password');
    fixture.detectChanges();

    const errorEl: DebugElement = fixture.debugElement.query(By.css('.alert'));
    expect(errorEl.nativeElement.textContent).toContain('Invalid email or password');
  });
});
