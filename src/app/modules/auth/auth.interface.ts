export interface IRegisterCustomerPayload {
  name: string;
  email: string;
  password: string;
}

export interface ILoginCustomerPayload {
  email: string;
  password: string;
}
