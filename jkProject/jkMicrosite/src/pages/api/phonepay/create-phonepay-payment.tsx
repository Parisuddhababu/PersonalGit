import APICONFIG from "@config/api.config";

const crypto = require("crypto");
const axios = require("axios");

const CreatePhonepayPayment = async (req: any, res: any) => {
  try {
    const data = {
      merchantId: req.body.merchant_id,
      merchantTransactionId: req.body.transactionId,
      merchantUserId: req.body.MUID,
      amount: req.body.amount,
      redirectUrl: req.body.redirectUrl,
      redirectMode: "REDIRECT",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + req.body.salt_key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const prod_URL = APICONFIG.PHONEPE_PROD_URL_FOR_PAY;
    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    axios
      .request(options)
      .then(function (response: any) {
        res.json({
          data: response.data.data.instrumentResponse.redirectInfo.url,
        });
      })
      .catch(function (error: any) {
        res.json({
          error: error.message,
        });
      });
  } catch (error: any) {
    res.json({
      error: error.message,
    });
  }
};

export default CreatePhonepayPayment;
