import { serialize } from "cookie";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import { encryptDecrypt } from "@components/Hooks/paymentGatewayKey/usePaymentGatewayKey";
import APPCONFIG from "@config/app.config";
import { IPaymentGatewayKeyProps } from "@components/Hooks/paymentGatewayKey";
const ccav = require("src/util/ccavenue.js");

const PostResponse = async (request: any, response: any) => {
  const data = request.body;
  let ccavEncResponse = "";
  let ccavResponse = "";
  const res = await pagesServices.paymentKeyDetailsForApi(APICONFIG.PAYMENT_GATEWAT_KEYS, request, {});
  const index = await res?.data?.payment_gateway_details?.findIndex(
    (ele: IPaymentGatewayKeyProps) => ele?.payment_gateway_name && ele?.payment_gateway_name.toLowerCase() === APPCONFIG.PAYMENT_METHODS.ccavenue
  );
  const workingKey = encryptDecrypt(res?.data?.payment_gateway_details?.[index]?.CCAVENUE_APP_SECRET);
  if (data) {
    ccavEncResponse = data.encResp;
    const encryption = ccavEncResponse;
    ccavResponse = ccav.decrypt(encryption, workingKey);
  }
  response.setHeader("Set-Cookie", serialize("ccavResponse", ccavResponse, { path: "/" }));
  response.redirect("/cc-avenue-payment/");
};

export default PostResponse;
