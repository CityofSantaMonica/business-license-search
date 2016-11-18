//HEAD 
(function(app) {
try { app = angular.module("businessLicenseSearch.templates"); }
catch(err) { app = angular.module("businessLicenseSearch.templates", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("index.html","<p class=\"alert alert-info fade in\" ng-hide=\"vm.ready || vm.error\">\n" +
    "    <span class=\"glyphicon glyphicon-refresh glyphicon-spin\"></span> Loading data (this may take up to 30 seconds)...\n" +
    "</p>\n" +
    "\n" +
    "<p class=\"alert alert-warning\" ng-show=\"vm.results && vm.results.length == 0\">\n" +
    "    No results match your search.\n" +
    "</p>\n" +
    "\n" +
    "<p class=\"alert alert-danger fade in\" ng-show=\"vm.error\">\n" +
    "    Error loading data. Please try again later.\n" +
    "</p>\n" +
    "\n" +
    "<div class=\"form\" ng-show=\"vm.ready\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"license-number\">Business License Number</label>\n" +
    "        <input type=\"text\" id=\"license-number\" class=\"form-control\" ng-model=\"vm.id\" />\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"license-number\">Business Name</label>\n" +
    "        <input type=\"text\" id=\"business-name\" class=\"form-control\" ng-model=\"vm.dba\" />\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"business-category\">Business Category</label>\n" +
    "        <select id=\"business-category\" class=\"form-control\" ng-model=\"vm.category\" ng-options=\"c for c in vm.categories\"></select>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"license-number\">Business Address</label>\n" +
    "        <input type=\"text\" id=\"business-address\" class=\"form-control\" ng-model=\"vm.address\" />\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"vm.search()\">Search</button>\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"vm.reset()\">Clear</button>\n" +
    "        <button type=\"button\" class=\"btn btn-secondary pull-right\" ng-show=\"vm.results && vm.results.length > 0\" ng-csv=\"vm.results\" csv-header=\"['License Number', 'Business Name', 'Address', 'City', 'State', 'Zip', 'Business Category']\" filename=\"business-licenses.csv\">Export to CSV</button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"vm.results && vm.results.length > 0\">\n" +
    "    <h2>Results</h2>\n" +
    "    <table class=\"table-custom table table-striped\" ng-table=\"vm.tableParams\">\n" +
    "        <tr ng-repeat=\"business in $data\">\n" +
    "            <td data-title=\"'License No.'\" sortable=\"'license_number'\">{{ business.license_number }}</td>\n" +
    "            <td data-title=\"'Name'\" sortable=\"'dba'\">{{ business.dba }}</td>\n" +
    "            <td data-title=\"'Category'\" sortable=\"'business_type'\">{{ business.business_type }}</td>\n" +
    "            <td data-title=\"'Address'\">\n" +
    "                <span ng-if=\"business.address && business.city && business.state && business.zip_code\">\n" +
    "                    <a href=\"https://www.google.com/maps/place/{{ business.address | replace:'\\\\.':'' | replace:'\\\\s':'+' }},+{{ business.city | replace:'\\\\s':'+' }},+{{ business.state }}+{{ business.zip_code }}\"\n" +
    "                       target=\"_blank\">\n" +
    "                        {{ business.address }}\n" +
    "                        <br />\n" +
    "                        {{ business.city }}, {{ business.state }} {{ business.zip_code }}\n" +
    "                    </a>\n" +
    "                </span>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</div>")
}]);
})();