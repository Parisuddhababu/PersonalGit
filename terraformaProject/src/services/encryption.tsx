import * as CryptoJS from 'crypto-js';
type WordArray = CryptoJS.lib.WordArray;
const EncryptionFunction = (text: string | WordArray) => {
	const key = process.env.REACT_APP_ENCRYPTION_DECRYPTION_KEY as WordArray | string;
	return CryptoJS.AES.encrypt(JSON.stringify(text), key).toString();
};
export default EncryptionFunction;
