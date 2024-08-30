import * as CryptoJS from 'crypto-js';

type CipherParams = CryptoJS.lib.CipherParams;
type WordArray = CryptoJS.lib.WordArray;

const DecryptionFunction = (text: string | CipherParams) => {
	const key = process.env.REACT_APP_ENCRYPTION_DECRYPTION_KEY as WordArray | string;
	return JSON.parse(CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8));
};
export default DecryptionFunction;
