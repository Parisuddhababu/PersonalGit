export interface ICareerApplication {
    first_name: string;
    email: string;
    contact: string;
    message: string;
    country : string;
    country_phone_code : string;
    current_location : string;
    experience : string;
    notice_period : number;
    file : Blob | string
}

export interface ICareerApplicationProps {
    toggleModal : () => void;
    careerId : string
}