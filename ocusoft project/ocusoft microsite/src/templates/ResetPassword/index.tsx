import { IBaseTemplateProps } from "@templates/index";
import ResetPassword from "@templates/ResetPassword/reset-password";
import { IResetPassword } from "@type/Pages/resetPassword";

export interface IResetPasswordProps extends IBaseTemplateProps, IResetPassword { }

export default ResetPassword;
