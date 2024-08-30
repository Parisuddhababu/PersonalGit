export interface PaymentStatusProps {
  PaymentId: string;
  TranId: string;
  Payment: string;
  ECI: number | string;
  Result: 'Successful' | 'UnSuccessful';
  TrackId: string;
  AuthCode: string | number;
  ResponseCode: string;
  RRN: number | string;
  responseHash: string;
  cardBrand: string;
  amount: number | string;
  UserField1: string;
  UserField3: string;
  UserField4: string;
  UserField5: string;
  cardToken: string;
  maskedPAN: string | number;
  email: string;
  payFor: string;
  SubscriptionId: string | number | null;
  PaymentType: string;
  metaData: string;
}

export interface PaymentResponseCodeMessages {
  [key: string]: string;
}
