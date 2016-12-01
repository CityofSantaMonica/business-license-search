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