export const validationMessages = (label = '', count = '') => {
  const Messages = {
    nameMaxCharater: `Max ${label} Characters are allowed`,
    nameMinCharacter: `Too short`,
    nameAlphabetCharacter: `${label} allow only alphabets and special character`,
    isRequired: `${label} is required`,
    nameAlphabetOnly: `${label} allow only alphabets`,
    labelValid: `Please enter valid ${label}`,
    toShortWithCount: `${label} is too short - should be ${count} chars minimum.`,
    pleaseSelect: `Please select ${label}`,
  };
  return Messages;
};

export const RegexPattern = () => {
  const pattern = {
    name: /^[a-zA-Z\s]+$/,
    phoneNumber: /^\(?(\d{3})\)?([ .-]?)(\d{3})\2(\d{4})$/,
  };
  return pattern;
};
