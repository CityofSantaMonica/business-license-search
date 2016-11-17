﻿(function() {
  "use strict";

  angular
    .module("businessLicenseSearch", [
        "ngCsv",
        "ngResource",
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