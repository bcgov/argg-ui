// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  bcdc_base_url: "https://catalogue.data.gov.bc.ca",
  bcdc_api_path: "/api/3/action",
  argg_api_base_url: "http://localhost:5000",
  license_list_url: "https://licenses-bcdc.data.gov.bc.ca/bcdc_licenses.json"
};


//security_classifications_url: "/assets/security-classifications.json",
//view_audiences_url: "/assets/view-audiences.json",

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
