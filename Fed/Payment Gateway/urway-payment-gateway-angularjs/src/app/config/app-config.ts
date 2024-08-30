import { environment } from "src/environments/environment";

const BASE_URL = environment.serviceURL;
const MERCHANT_KEY = environment.mechantkey;
const TERMINAL_ID = environment.terminalId;
const PASSWORD = environment.password;
const MERCHANT_IP = environment.merchantIp
const ACTION = environment.action

export const CONFIG = {
  baseUrl: BASE_URL,
  merchantKey: MERCHANT_KEY,
  terminalId: TERMINAL_ID,
  password: PASSWORD,
  merchantIp: MERCHANT_IP,
  action: ACTION,
  tokenizationType: 1
}
