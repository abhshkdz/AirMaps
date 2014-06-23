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

  maps.generatePlace = function (place) {
    var checkpoint = airmaps.ge.createPlacemark('');
    var point      = airmaps.ge.createPoint('');
    var icon       = airmaps.ge.createIcon('');
    var style      = airmaps.ge.createStyle('');

    icon.setHref(place.icon);
    checkpoint.setName(place.name);
    point.setLatitude(place.lat);
    point.setLongitude(place.lng);
    checkpoint.setGeometry(point);
    style.getIconStyle().setIcon(icon);
    style.getIconStyle().setScale(2.0);
    checkpoint.setStyleSelector(style);
    airmaps.ge.getFeatures().appendChild(checkpoint);
  };

  airmaps.maps = maps;

})(airmaps);
