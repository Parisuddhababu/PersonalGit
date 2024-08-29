

export interface IContactList {
    contactus_contact_number: string;
    contactus_email: string;
    country: ICountry;
    address1: string;
    address2: string;
    address3: string;
}

export interface ICountry {
    country_phone_code: string
}

export interface IContactUsAddress { 
    type : number,
    data : {}
}
