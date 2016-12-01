(function() {
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
      })
      .otherwise({
        redirectTo: "/"
      });
  }

})();
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
(function() {
  "use strict";

  angular
    .module("businessLicenseSearch")
    .component("businessLicenseSearch", {
      controller: [
        "BusinessLicenseApi",
        "$filter",
        "NgTableParams",
        SearchController],
      templateUrl: "business-license-search.html"
    });

  function SearchController(BusinessLicenseApi, $filter, NgTableParams) {
    var ctrl = this;

    ctrl.$onInit = function() {
      //viewmodel for the search form
      ctrl.id = "";
      ctrl.dba = "";
      ctrl.address = "";
      ctrl.category = "";
      ctrl.ready = false;
      ctrl.error = false;
      ctrl.records = [];

      ctrl.tableParams = new NgTableParams({
          count: 0,
          sorting: {
            dba: "asc"
          }
        }, {
          counts: [],
          getData: function(params) {
            var orderedData = params.sorting()
              ? $filter("orderBy")(ctrl.results, params.orderBy())
              : ctrl.results

            return orderedData;
          }
        });

      BusinessLicenseApi.load().then(
        function success(response) {
          ctrl.records = response.data;

          ctrl.categories = ctrl.records.reduce(function(prev, current) {
            if (prev.indexOf(current.business_type) < 0) {
              prev.push(current.business_type);
            }
            return prev;
          }, []).sort();
          
          ctrl.ready = true;
        },
        function error(response) {
          ctrl.error = true;
        }
      );
    };

    //reset the viewmodel's state
    ctrl.reset = function() {
      ctrl.id = "";
      ctrl.dba = "";
      ctrl.address = "";
      ctrl.category = "";
      ctrl.results = undefined;
      ctrl.tableParams.reload();
    };

    //execute a search with the current state of the viewmodel
    ctrl.search = function() {
      var results = [];

      if (ctrl.id || ctrl.dba || ctrl.category || ctrl.address) {
        results = ctrl.records;
        results = $filter("filter")(results, { license_number: ctrl.id });
        results = $filter("filter")(results, { dba: ctrl.dba });
        results = $filter("filter")(results, { business_type: ctrl.category });
        results = $filter("byAddress")(results, ctrl.address);
      }

      ctrl.results = results;
      ctrl.tableParams.reload();
    };
  }
})();
(function() {
  "use strict";

  angular
    .module("businessLicenseSearch")
    .filter("byAddress", byAddress)
    .filter("replace", replace);

  //filter the given array for items with a (partial) matching address
  function byAddress() {
    return function(inputs, address) {
      if (address.length < 1)
        return inputs;

      address = address.toLowerCase();

      return (inputs || []).filter(function(i) {
        var hit = i.address && i.address.toLowerCase().indexOf(address) > -1;
        hit = hit || i.city && i.city.toLowerCase().indexOf(address) > -1;
        hit = hit || i.address && i.state.toLowerCase().indexOf(address) > -1;
        hit = hit || i.zip_code && i.zip_code.indexOf(address) > -1;
        return hit;
      });
    }
  }

  //simple filter for string replacement using regex
  function replace() {
    return function(input, pattern, replacement) {
      var regex = new RegExp(pattern, "g");
      return input.replace(regex, replacement);
    };
  }
})();