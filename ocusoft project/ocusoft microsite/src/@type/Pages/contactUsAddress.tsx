

export interface IContactAddress {
    first_name: string;
    email: string;
    description: string;
    country: string;
}

export interface IBannerDataContactUs {
    data: {
        link?: string
    }
}

export interface IContactList {
    _id: string,
    name: string,
    country_code: string,
    country_phone_code: string,
    currency_code: string,
    currency_symbol: string,
    country_flag: ICountryFlag[],
    is_default?: number,
    latitude?: number,
    longitude?: number
}

export interface ICountryFlag {
    _id: string,
    file_name: string,
    path: string,
    relative_path: string
}




export interface IContactData {
    meta: Meta
    data: Data
    errors:any;
}

export interface Meta {
    status: boolean
    message: string
    message_code: string
    status_code: number
}

export interface Data {
    first_name: string
    country: Country
    email: string
    description: string
    account: Account
    status: number
    created_by: string
    updated_at: string
    created_at: string
    _id: string
}

export interface Country {
    country_id: string
    name: string
    country_code: string
    country_phone_code: string
    currency_code: string
    currency_symbol: string
    country_flag: CountryFlag[]
}

export interface CountryFlag {
    _id: string
    file_name: string
    path: string
}

export interface Account {
    account_id: string
    account_name: string
    code: string
    ip_address: null;
    url: string
    subdomain_url: string
}
