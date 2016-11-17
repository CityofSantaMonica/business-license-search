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
  function byId(){
    return function(inputs, id) {
      if (id.length < 1)
        return inputs;

      return (inputs || []).filter(function(i) {
        return i.license_number && i.license_number.indexOf(id) > -1;
      });
    }
  }

  //filter the given array for items with a (partial) matching dba
  function byDba(){
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