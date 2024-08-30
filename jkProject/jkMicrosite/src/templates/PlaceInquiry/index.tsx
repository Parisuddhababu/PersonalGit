import PlaceInquiry from "./place-inquiry";

export interface IPlaceInquiryProps {
    email: string,
    address: string,
    lastName: string,
    firstName: string,
    companyName: string,
    termsAndConditions: boolean,
}

export default PlaceInquiry;