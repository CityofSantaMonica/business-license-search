(function() {
  "use strict";

  angular
    .module("businessLicenseSearch")
    .value("apiRoot", "/api/BusinessLicenses")
    //service for accessing values passed into javascript from the server
    .factory("BusinessLicenseSettings", ["apiRoot", "$resource", BusinessLicenseSettings])
    //service providing access to a BusinessLicenseRecords singleton with injected dependencies
    .service("BusinessLicenseRecords", ["apiRoot", "$q", "$http", "BusinessLicenseSettings", BusinessLicenseRecords]);

  function BusinessLicenseSettings(apiRoot, $resource) {
    return $resource(apiRoot + "/Settings", {}, {
      get: { method: "GET" }
    });
  }

  function BusinessLicenseRecords(apiRoot, $q, $http, BusinessLicenseSettings) {
    //get the total number of records from the server, as a plain int
    var getCount = function() {
      return $http.get(apiRoot + "/Count", { cache: true }).then(function(response) {
        return response.data || 0;
      });
    };

    //get a page of directory data from the server, with the given size, as an array of objects
    var getPage = function(page, size, settings) {
      page = page || 0;
      size = size || settings.PageSize;
      return $http.get(apiRoot + "/" + page + "/" + size, { cache: true }).then(function(response) {
        return response.data || [];
      });
    };

    //create an array of request objects
    var createRequests = function(recordCount, settings) {
      //get the number of pages we'll be requesting
      var pages = Math.ceil((recordCount || 0) / settings.PageSize);
      //create an array of request parameter objects, one for each page
      return Array
              .apply(null, Array(pages))
              .map(function(_, index) {
                return { page: index, size: settings.PageSize };
              });
    };

    //asynchronously load each page of the directory
    //execute a callback when all results are in
    this.load = function(doneLoadingCallback) {
      BusinessLicenseSettings.get(function(settings) {
        getCount().then(function(count) {
          var pageRequests = createRequests(count, settings);
          //consolidates the array of promises into a single promise
          //the single promise resolves when all of the inner promises resolve.
          $q.all(
            //create an array of promises, one for each page request
            //a promise resolves when the server responds to the request
            pageRequests.map(
              function(request) {
                return getPage(request.page, request.size, settings);
              }
            )
          ).then(
          //once the consolidated promise has resolved
            function(results) {
              var directory = [];
              //map all of the results into a single array
              results.map(function(partial) {
                directory = directory.concat(partial);
              });
              //and callback
              doneLoadingCallback(directory);
            }
          );
        });
      });
    };
  }

})();