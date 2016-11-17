(function() {
  "use strict";

  angular
    .module("businessLicenseSearch")
    .controller("SearchController", ["BusinessLicenseRecords", "$filter", "ngTableParams", SearchController]);

  function SearchController(BusinessLicenseRecords, $filter, ngTableParams) {
    //alias 'this' for more intuitive front-end access
    var vm = this;
    //viewmodel for the search form
    vm.id = "";
    vm.dba = "";
    vm.address = "";
    vm.category = "";
    vm.ready = false;
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
    BusinessLicenseRecords.load(function(records) {
      vm.categories = records.reduce(function(prev, current) {
        if (prev.indexOf(current.business_type) < 0) {
          prev.push(current.business_type);
        }
        return prev;
      }, []).sort();

      vm.records = records;

      //see https://github.com/esvit/ng-table/wiki/Configuring-your-table-with-ngTableParams
      vm.tableParams = new ngTableParams({
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
    });
  }
})();