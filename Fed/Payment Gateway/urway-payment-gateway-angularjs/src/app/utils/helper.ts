export const generateSecureRandomNumber = () => {
  const array = new Uint32Array(4);
  if (window?.crypto) {
    window.crypto.getRandomValues(array);
  }
  const randomNumber = array[0];
  return randomNumber;
};
