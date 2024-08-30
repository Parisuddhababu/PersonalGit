import * as Yup from "yup";
import { validationMessages } from "../constants/validationMessages";

export const FirebaseLoginValidator = Yup.object({
  email: Yup.string()
    .email(validationMessages("Email").mustBeValid)
    .max(255, validationMessages("255").nameMaxCharater)
    .required(validationMessages("Email").isRequired),
  password: Yup.string()
    .max(255, validationMessages("255").nameMaxCharater)
    .required(validationMessages("Password").isRequired),
});
