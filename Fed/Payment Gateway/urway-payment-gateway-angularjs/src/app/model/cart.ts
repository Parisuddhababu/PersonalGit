export interface ICartForm {
  firstName: string;
  lastName: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  customerEmail: string;
  amount: number | string;
}

export interface IPaynowApiRequestParam extends ICartForm {
  currency: string;
  country: string;
  trackid: number | string;
  terminalId: string;
  merchantIp: string;
  password: string;
  requestHash: string;
  action: number;
  udf1: string;
  udf2: string;
  udf3: string;
  udf4: string;
  tokenizationType: number;
  transid: string | number;
}
