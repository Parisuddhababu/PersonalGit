export type LoginInput = {
    email: string
    password: string
}

export type ForgotPasswordInput = {
    email: string
    userType: string
}

export type ResetPasswordInput = {
    newPassword: string
    confirmPassword: string
    token:string
}

export interface ICountryData {
    country_code: string;
    phone_code: string;
    uuid: string;
    name: string;
}

export interface Country {
    country_code: string;
    phone_code: string;
    name: string;
}

export interface SelectedOption {
    label: string;
    value: string;
}