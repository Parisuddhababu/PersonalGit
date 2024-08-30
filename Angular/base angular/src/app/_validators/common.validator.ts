import { Validators } from '@angular/forms';

const NameRegx = /^[a-zA-Z ]+$/;
const PriceRegx = /^(\d+(\.\d{1,2})?)$/;
const PasswordRegx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*\d)(?=.*[@!$%^&#])[A-Za-z\d@!$%^&#]{8,50}$/;
const UsernameRegx = /^[A-Za-z\d._+]{2,50}$/;
const phoneNumberRegex = /^((\\+91-?)|0)?[0-9]{10,13}$/;
const emailRegx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const folderNameRegex = /^[a-zA-Z\d._\-]+(([',. -][a-zA-Z\d._\- ])?[a-zA-Z\d._\- ]*)*$/;
const offerCodeRegx = /^[a-zA-Z0-9]{6,6}$/;
const percentRegx = /^(100(\.0{1,2})?|[1-9]?[0-9](\.[0-9]{1,2})?)$/;
const planNameRegx = /^[A-Za-z\d._+ ]{2,50}$/;

export const emailValidator = Validators.pattern(emailRegx);
export const passwordValidator = Validators.pattern(PasswordRegx);

const Validator = {
  emailValidator,
  passwordValidator,
};

export const CommonRegx = {
  NameRegx,
  emailRegx,
  PasswordRegx,
  PriceRegx,
  UsernameRegx,
  phoneNumberRegex,
  folderNameRegex,
  offerCodeRegx,
  percentRegx,
  planNameRegx,
};

export default Validator;
