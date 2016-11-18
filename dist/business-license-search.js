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
        controller: "SearchController",
        controllerAs: "vm"
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
    .controller("SearchController", [
      "BusinessLicenseRecords",
      "$filter",
      "NgTableParams",
      SearchController
    ]);

  function SearchController(BusinessLicenseRecords, $filter, NgTableParams) {
    //alias 'this' for more intuitive front-end access
    var vm = this;
    //viewmodel for the search form
    vm.id = "";
    vm.dba = "";
    vm.address = "";
    vm.category = "";
    vm.ready = false;
    vm.error = false;
    //the local data cache
    vm.records = undefined;
    //the local data cache of unique business categories
    vm.categories = undefined;
    //viewmodel for the results table
    vm.results = undefined;
    vm.tableParams = undefined;

    //reset the viewmodel's state
    vm.reset = function() {
      vm.id = "";
      vm.dba = "";
      vm.address = "";
      vm.category = "";
      vm.results = undefined;
      vm.tableParams.reload();
    };

    //execute a search with the current state of the viewmodel
    vm.search = function() {
      if (vm.id || vm.dba || vm.address || vm.category) {
        var results = vm.records;

        results = $filter("byId")(results, vm.id);
        results = $filter("byDba")(results, vm.dba);
        results = $filter("byAddress")(results, vm.address);
        results = $filter("byCategory")(results, vm.category);

        vm.results = results;
        vm.tableParams.reload();
      }
    };
    
    //called as the controller initializes
    BusinessLicenseRecords.load().then(
      function success(response) {
        vm.records = response.data;

        vm.categories = vm.records.reduce(function(prev, current) {
          if (prev.indexOf(current.business_type) < 0) {
            prev.push(current.business_type);
          }
          return prev;
        }, []).sort();

        vm.tableParams = new NgTableParams({
          count: 0,
          sorting: {
            dba: "asc"
          }
        }, {
          counts: [],
          total: (vm.results || []).length,
          getData: function($defer, params) {
            var orderedData = params.sorting()
              ? $filter("orderBy")(vm.results, params.orderBy())
              : vm.results

            $defer.resolve(orderedData);
          }
        });

        vm.ready = true;
      },
      function error(response) {
        vm.error = true;
      }
    );
  }
})();
(function() {
  "use strict";

  angular
    .module("businessLicenseSearch")
    .filter("byId", byId)
    .filter("byDba", byDba)
    .filter("byAddress", byAddress)
    .filter("byCategory", byCategory)
    .filter("replace", replace);

  //filter the given array for items with a (partial) matching id
  function byId() {
    return function(inputs, id) {
      if (id.length < 1)
        return inputs;

      return (inputs || []).filter(function(i) {
        return i.license_number && i.license_number.indexOf(id) > -1;
      });
    }
  }

  //filter the given array for items with a (partial) matching dba
  function byDba() {
    return function(inputs, dba) {
      if (dba.length < 1)
        return inputs;

      dba = dba.toLowerCase();

      return (inputs || []).filter(function(i) {
        return i.dba && i.dba.toLowerCase().indexOf(dba) > -1;
      });
    }
  }

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

  //filter the given array for items with a (partial) matching category
  function byCategory() {
    return function(inputs, category) {
      if (category.length < 1)
        return inputs;

      category = category.toLowerCase();

      return (inputs || []).filter(function (i) {
        return i.business_type && i.business_type.toLowerCase().indexOf(category) === 0;
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