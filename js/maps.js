(function (airmaps) {
  'use strict';

  var maps = maps || {};

  maps.getCoordinates = function (address, callback) {
    $.ajax({
      url: 'http://maps.googleapis.com/maps/api/geocode/json?address='
        + address + '&sensor=false',
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        if (typeof data !== 'object') data = JSON.parse(data);
        var position = {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng
        };

        callback(position);
      },
      error: function (xhr, status, error) {
        console.log(xhr);
      }
    });
  };

  maps.getNearbyPlaces = function (position, callback) {
    $.ajax({
      url: 'request/google.php?lat=' + position.lat + '&lng=' + position.lng,
      dataType: 'json',
      success: function (data) {
        if (typeof data !== 'object') data = JSON.parse(data);
        var nearby = [];
        var results = data.results;
        var place, i;
        for (i in results) {
          place = {
            id: results[i].id,
            name: results[i].name,
            icon: results[i].icon,
            lat: results[i].geometry.location.lat,
            lng: results[i].geometry.location.lng,
          };

          nearby.push(place);
        }

        callback(nearby);
      },
      error: function (xhr, status, error) {
        console.log(xhr);
      }
    });
  };

  airmaps.maps = maps;

})(airmaps);
