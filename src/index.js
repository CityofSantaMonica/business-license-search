﻿(function() {
  "use strict";

  angular
    .module("businessLicenseSearch", [
        "businessLicenseSearch.settings",
        "businessLicenseSearch.templates",
        "ngCsv",
        "ngRoute",
        "ngTable"
    ])
    .config(["$routeProvider", routeRegistration]);

  function routeRegistration($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "index.html",
        controller: "SearchController",
        controllerAs: "vm"
      })
      .otherwise({
        redirectTo: "/"
      });
  }

})();