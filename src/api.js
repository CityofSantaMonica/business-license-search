(function() {
  "use strict";

  angular
    .module("businessLicenseSearch")
    .service("BusinessLicenseApi", [
      "$http",
      "BusinessLicenseSettings",
      BusinessLicenseApi
    ]);

  function BusinessLicenseApi($http, settings) {
    this.load = function() {
      var url = [settings.host, "resource", settings.id].join("/");
      //max out the $limit for 2.0 endpoints
      //https://dev.socrata.com/docs/queries/limit.html
      var query = "?$limit=50000";

      return $http({
        cache: true,
        method: "GET",
        url: url + query,
        headers: { Accept: "application/json" }
      });
    };
  }

})();