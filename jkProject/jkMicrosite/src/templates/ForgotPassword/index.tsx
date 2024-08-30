import { IBaseTemplateProps } from "@templates/index";
import ForgotPassword from "@templates/ForgotPassword/forgot-password";
import { IForgotPassword } from "@type/Pages/forgotPassword";

export interface IForgotPasswordProps extends IBaseTemplateProps, IForgotPassword { }

export default ForgotPassword;
