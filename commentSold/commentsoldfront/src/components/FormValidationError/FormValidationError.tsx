import { IFormValidationErrorProps } from "@/types/components";

const FormValidationError = ({ errors, name }: IFormValidationErrorProps) => {
  const error = errors?.[name];
  
  return (
    <>
      {error?.message ? (
        <small className="p-error">{error.message as string}</small>
      ) : null}
    </>
  );
};

export default FormValidationError;
