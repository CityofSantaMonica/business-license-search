(function() {
  "use strict";

  angular
    .module("businessLicenseSearch.settings", [])
    .service("BusinessLicenseSettings", BusinessLicenseSettings);

  function BusinessLicenseSettings() {
    this.host = "https://data.smgov.net";
    this.id = "gfc6-tnen";
  }

})();