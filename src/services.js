(function() {
  "use strict";

  angular
    .module("businessLicenseSearch")
    .service("BusinessLicenseRecords", [
      "$http",
      "BusinessLicenseSettings",
      BusinessLicenseRecords
    ]);

  function BusinessLicenseRecords($http, settings) {
    this.load = function() {
      return $http({
        method: "GET",
        url: [settings.host, "resource", settings.id].join("/"),
        headers: { Accept: "application/json" }
      });
    };
  }

})();