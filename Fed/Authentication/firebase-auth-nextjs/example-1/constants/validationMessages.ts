export const validationMessages = (label = "") => {
  const Messages = {
    mustBeValid: `Must be a valid ${label}`,
    nameMaxCharater: `Max ${label} Characters are allowed`,
    isRequired: `${label} is required`
  };
  return Messages;
};