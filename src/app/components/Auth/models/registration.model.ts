export interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  countryId: string;
  provinceId: string;
}

export interface Province {
  id: string;
  name: string;
  countryId: string;
}

export interface Country {
  id: string;
  name: string;
  provinces: Province[];
}
