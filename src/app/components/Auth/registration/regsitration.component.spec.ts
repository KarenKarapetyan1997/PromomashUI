import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { of } from 'rxjs';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let registrationServiceStub: Partial<RegistrationService>;

  beforeEach(async () => {
    registrationServiceStub = {
      getCountries: () => of([{ id: '1', name: 'USA' }]),
      getProvinces: (countryId: string) => of([{ id: '1', name: 'California' }])
    };
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegistrationComponent],
      providers: [{ provide: RegistrationService, useValue: registrationServiceStub }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form on init', () => {
    expect(component.registrationForm.valid).toBeFalse();
  });

  it('should move to step 2 when step 1 is valid', () => {
    component.registrationForm.controls['login'].setValue('testuser');
    component.registrationForm.controls['password'].setValue('123456');
    component.registrationForm.controls['confirmPassword'].setValue('123456');
    component.registrationForm.controls['agree'].setValue(true);
    component.nextStep();
    expect(component.step).toBe(2);
  });

  it('should call submit and log form value when form is valid', () => {
    spyOn(console, 'log');
    component.registrationForm.controls['login'].setValue('testuser');
    component.registrationForm.controls['password'].setValue('123456');
    component.registrationForm.controls['confirmPassword'].setValue('123456');
    component.registrationForm.controls['agree'].setValue(true);
    component.nextStep();
    component.registrationForm.controls['country'].setValue('1');
    component.registrationForm.controls['province'].setValue('1');
    component.submit();
    expect(console.log).toHaveBeenCalledWith('Registration form submitted:', component.registrationForm.value);
  });
});
