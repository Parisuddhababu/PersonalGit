

export interface IContactAddress {
    first_name: string;
    last_name: string;
    mobile_number: string;
    email: string;
    message: string;
    country_id: string;
}

export interface IBannerDataContactUs {
    data: {
        link ?: string
    }
}

export interface IContactList {
    _id : string,
    name : string,
    country_code : string,
    country_phone_code : string,
    currency_code : string,
    currency_symbol : string,
    country_flag : ICountryFlag[],
    is_default ?: number ,
    latitude ?: number,
    longitude ?: number
}

export interface ICountryFlag {
    _id : string,
    file_name : string,
    path : string,
    relative_path : string
}