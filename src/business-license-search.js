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
              ? $filter("orderBy")(ctrl.results(), params.orderBy())
              : ctrl.results()

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

    //calculate results for the current state of the viewmodel
    ctrl.results = function() {
      if (ctrl._results) {
        return ctrl._results.map(function(r) {
            return {
              license_number: r.license_number,
              dba: r.dba,
              address: r.address,
              city: r.city,
              state: r.state,
              zip_code: r.zip_code,
              business_type: r.business_type,
            };
        });
      }
      return undefined;
    }

    //determine if the viewmodel has filtered results
    ctrl.hasResults = function() {
      return ctrl.results() && ctrl.results().length > 0;
    }

    //reset the viewmodel's state
    ctrl.reset = function() {
      ctrl.id = "";
      ctrl.dba = "";
      ctrl.address = "";
      ctrl.category = "";
      ctrl._results = undefined;
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

      ctrl._results = results;
      ctrl.tableParams.reload();
    };
  }
})();
