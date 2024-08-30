import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import { useEffect, useState } from "react";
import { IPaymentGatewayKeyProps, PaymentGatewayKeyOutputInterface } from "@components/Hooks/paymentGatewayKey";
import APPCONFIG from "@config/app.config";

// @ts-ignore
import Base64 from "crypto-js/enc-base64";

let CryptoJS = require("crypto-js");

export const encryptDecrypt = (ciphertext?: string): string | undefined => {
  let key = APPCONFIG.PAYMENT_METHOD_KEY_ENCRYPTION.ENCRYPTION_KEY;
  if (!ciphertext) return;
  // Convert key and ciphertext into WordArrays
  let ciphertextWA = Base64.parse(ciphertext);
  let keyWA = CryptoJS.enc.Utf8.parse(key);

  // Separate IV, HMAC and ciphertext
  let ivWA = CryptoJS.lib.WordArray.create(ciphertextWA.words.slice(0, 4));
  let hmacWA = CryptoJS.lib.WordArray.create(ciphertextWA.words.slice(4, 4 + 8));
  let actualCiphertextWA = CryptoJS.lib.WordArray.create(ciphertextWA.words.slice(4 + 8));

  // Authenticate
  let hmacCalculatedWA = CryptoJS.HmacSHA256(actualCiphertextWA, keyWA);
  if (CryptoJS.enc.Base64.stringify(hmacCalculatedWA) === CryptoJS.enc.Base64.stringify(hmacWA)) {
    // Decrypt if authentication is successfull
    let decryptedMessageWA = CryptoJS.AES.decrypt({ ciphertext: actualCiphertextWA }, keyWA, { iv: ivWA });
    return CryptoJS.enc.Utf8.stringify(decryptedMessageWA);
  }
};

const usePaymentGatewayKey = (): PaymentGatewayKeyOutputInterface => {
  const [paymentGatewayKey, setPaymentGatewayKey] = useState<IPaymentGatewayKeyProps[]>();
  useEffect(() => {
    getPaymentMethodsKey();
  }, []);

  const getPaymentMethodsKey = async () => {
    if (paymentGatewayKey) {
      return paymentGatewayKey;
    } else {
      const response = await pagesServices.postPage(APICONFIG.PAYMENT_GATEWAT_KEYS, {});
      if (response?.data?.payment_gateway_details) {
        setPaymentGatewayKey(response?.data?.payment_gateway_details);
      }
    }
  };

  return {
    getPaymentMethodsKey,
    paymentGatewayKey
  };
};

export default usePaymentGatewayKey;
