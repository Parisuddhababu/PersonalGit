import * as Yup from 'yup';
export const validationMessages = (label = '', count = '') => {
  const Messages = {
    phoneNumber: `Enter a valid ${label}`,
    nameMaxCharater: `Max ${label} Characters are allowed`,
    nameMinCharacter: `Too short`,
    nameAlphabetCharacter: `${label} allow only alphabets and special character`,
    isRequired: `${label} is required`,
    maximumCharacter: `${label} must be less than ${count} characters`,
    mustBeValidCharacter: `Must be a valid ${label}`,
    minimumCharacter: `Minimum ${count} ${label}`,
    labelOnly: `${label} `,
    labelShouldBeNumber: `${label} should be number`,
    labelValid: `Please enter valid ${label}`,
    mustMatch: `${label} must match`,
  };
  return Messages;
};

export const VALIDATIONSECHEMA = (type: string, label: string) => {
  const icons: any = {
    AddressLine1: Yup.string().required(validationMessages(label).isRequired),
    AddressLine2: Yup.string().max(
      255,
      validationMessages(label, '255').maximumCharacter
    ),
    City: Yup.string().required(validationMessages(label).isRequired).max(255),
    PostalOrZipCode: Yup.string()
      .required(validationMessages(label).isRequired)
      .max(20, validationMessages(label, '20').maximumCharacter),
  };
  return icons[type];
};
