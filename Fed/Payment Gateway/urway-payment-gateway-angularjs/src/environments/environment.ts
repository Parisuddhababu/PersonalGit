// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mechantkey: 'Your URWAY Merchant key',
  terminalId: 'shahen',
  serviceURL:
    'https://payments-dev.urway-tech.com/URWAYPGService/transaction/jsonProcess/JSONrequest',
  password: process.env['ENVIRONMENT_PASSWORD'],
  merchantIp: 'YOUR_IP',
  action: 1,
};
