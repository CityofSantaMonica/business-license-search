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