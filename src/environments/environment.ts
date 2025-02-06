// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // adminApiBaseUrl: 'http://localhost:8081/api/',
  // productApiBaseUrl: 'http://localhost:8082/api',
  adminApiBaseUrl: 'https://bugtracker-admin.onrender.com/api/',
  productApiBaseUrl: 'https://bugtracker-9i69.onrender.com/api',
  cloudName: 'dxstfplms',
  uploadPreset: 'BUGTRACKER',
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
