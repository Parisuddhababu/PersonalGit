import { IImage, IMetaError } from "@type/Common/Base"

export interface IResetPassword {
    reset_password_banner : IResetPasswordForm[],
    reset_password_banner_type : number
}

export interface IResetPasswordBanner {
    _id : string,
    banner_title : string,
    link : string,
    banner_image : IImage,
    is_active : number,
    created_at : string
}

export interface IResetPasswordForm {
    new_password : string,
    confirm_password : string
}

export interface IResetPasswordRes {
    data : Array<[]>,
    meta : IMetaError,
    errors: any;
}