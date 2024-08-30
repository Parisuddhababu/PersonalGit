import React from "react";

const FormValidationError = ({ errors, name }) => {
  return (
    <>
      {errors?.[name] ? (
        <p className="error">{errors[name].message}</p>
      ) : null}
    </>
  );
};

export default FormValidationError;
