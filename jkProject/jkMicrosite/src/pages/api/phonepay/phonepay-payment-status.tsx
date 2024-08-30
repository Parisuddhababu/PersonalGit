import APICONFIG from "@config/api.config";

const axios = require("axios");
const crypto = require("crypto");

const CheckPhonepayStatus = async (req: any, res: any) => {
  const merchantTransactionId = req.body.transactionId;
  const merchantId = req.body.merchant_id;
  const saltKey = req.body.saltKey;

  const keyIndex = 1;
  const string =
    `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const options = {
    method: "GET",
    url: `${APICONFIG.PHONEPE_PROD_URL_FOR_STATUS}/${merchantId}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };

  const makeRequest = async () => {
    try {
      const response = await axios.request(options);
      const data = JSON.parse(JSON.stringify(response.data));
      res.json({ data: data });
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const retryAfterSeconds = error.response.headers["retry-after"] || 2;

        await new Promise((resolve) =>
          setTimeout(resolve, retryAfterSeconds * 1000)
        );
        await makeRequest(); // Retry the request
      } else {
        console.error("Request failed:", error.message);
        res.json({
          error: error.message,
        });
      }
    }
  };

  makeRequest();
};

export default CheckPhonepayStatus;
