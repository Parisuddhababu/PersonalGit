import { IImage } from "@type/Common/Base"

export interface IForgotPassword {
    forgot_password_banner : IForgotPasswordBanner[],
    forgot_password_banner_type : number
}

export interface IForgotPasswordBanner {
    _id : string,
    banner_title : string,
    link : string,
    banner_image : IImage,
    is_active : number,
    created_at : string
}

export interface IForgotPasswordForm {
    email : string
}