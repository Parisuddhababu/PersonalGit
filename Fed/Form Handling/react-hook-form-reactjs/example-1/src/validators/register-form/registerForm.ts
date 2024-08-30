import * as Yup from "yup";
import { RegexPattern, validationMessages } from "../../constants";

export const RegisterFormValidatorSchema = Yup.object({
  firstname: Yup.string()
    .min(2, validationMessages().nameMinCharacter)
    .max(10, validationMessages("10").nameMaxCharater)
    .matches(RegexPattern().name, validationMessages("First Name").nameAlphabetOnly)
    .required(validationMessages("First Name").isRequired),
  lastname: Yup.string()
    .min(2, validationMessages().nameMinCharacter)
    .max(10, validationMessages("10").nameMaxCharater)
    .matches(RegexPattern().name, validationMessages("Last Name").nameAlphabetOnly)
    .required(validationMessages("Last Name").isRequired),
  phone: Yup.string()
    .matches(RegexPattern().phoneNumber, validationMessages("Phone Number").labelValid)
    .max(10, validationMessages("10").nameMaxCharater)
    .required(validationMessages("Phone Number").isRequired),
  email: Yup.string()
    .email(validationMessages("Email").labelValid)
    .max(30, validationMessages("30").nameMaxCharater)
    .required(validationMessages("Work Email").isRequired),
  password: Yup.string()
    .min(10, validationMessages("Password", '10').toShortWithCount)
    .max(20, validationMessages("20").nameMaxCharater)
    .required(validationMessages("Password").isRequired),
  countrycode: Yup.string().required(validationMessages("Country Code").pleaseSelect),
});
