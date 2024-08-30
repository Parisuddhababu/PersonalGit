import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import { IPincodeMessage } from "@templates/ProductDetails/components/WebsiteProductDetail";
import { useState } from "react";

const useCheckPincode = () => {
  const [pinCodeMsgTimer, setPinCodeMsgTimer] = useState<boolean>(false);
  const [pinCodeMsg, setPinCodeMsg] = useState<IPincodeMessage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const pincodeMsgDisplayTimer = () => {
    let timeleft = 5;
    const downloadTimer = setInterval(() => {
      if (timeleft <= 0) {
        clearInterval(downloadTimer);
        setPinCodeMsgTimer(false);
      } else {
        setPinCodeMsgTimer(true);
      }
      timeleft -= 1;
    }, 2000);
  };

  const checkPincodeDelivery = async (pincode: string) => {
      setIsLoading(true)
      await pagesServices
        .getPage(APICONFIG.AVAILABLITY_BY_PINCODE(pincode), {})
        .then(
          async (result) => {
            setIsLoading(false);

            if (result?.meta && result?.meta?.status) {
              pincodeMsgDisplayTimer();
              setPinCodeMsg({ message: result?.meta?.message, isValid: true });
            }
          },
          (error) => {
            setIsLoading(false);
            const message = error?.meta?.message ?? "Delivery is unavailable for this pincode.";
            setPinCodeMsg({ message, isValid: false });
            pincodeMsgDisplayTimer();
          }
        );
  };

  return {
    checkPincodeDelivery,
    pinCodeMsgTimer,
    pinCodeMsg,
    isLoading
  };
};

export default useCheckPincode;
