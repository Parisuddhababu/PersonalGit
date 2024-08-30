// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --prod` or `ng build --configuration=production` then `environment.prod.ts` will be used instead.
// `ng build --configuration=staging` then `environment.stage.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.

export const environment = {
  production: false,
  apiEndpoint: 'https://baselumenphp8.demo.brainvire.dev',
  apiAdminVersion: '/admin/api/v1',
  apiFrontVersion: '/front/api/v1',
};
