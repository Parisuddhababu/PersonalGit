import ChangePasswordSection1 from "@templates/ChangePassword/components/Password/password";

export interface IChangePasswordForm {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export default ChangePasswordSection1;
