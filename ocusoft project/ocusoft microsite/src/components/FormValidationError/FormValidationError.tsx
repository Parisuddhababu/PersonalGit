import { IFormValidationErrorProps } from "@components/FormValidationError";

const FormValidationError = ({ errors, name }: IFormValidationErrorProps) => {
  return (
    <>
      {errors?.[name] ? (
        <small className="p-error">{errors[name].message}</small>
      ) : null}
    </>
  );
};

export default FormValidationError;
