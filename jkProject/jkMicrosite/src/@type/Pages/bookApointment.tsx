export interface IBookAppointment {
    first_name: string;
    last_name: string;
    email: string;
    contact: string;
    city?: string;
    date: any;
    time: any;
    message: string;
    country : string;
    country_phone_code : string | undefined;
}

export interface IBookAppointmentProps {
    toggleModal : () => void;
}