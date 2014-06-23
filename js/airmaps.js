(function (google) {
  'use strict';

  var airmaps = airmaps || {};

  airmaps.initCity = function () {
    var _this = this;

    this.maps.getCoordinates(this.address, function (position) {
      console.log('position obtained: ' + position.lat + ', ' + position.lng);
      _this.position = position;
      _this.camera.init(position.lat, position.lng);
      // _this.camera.fly(position);
      _this.maps.getNearbyPlaces(position, function (nearby) {
        for (var i in nearby) {
          var place = nearby[i];
          // _this.maps.generatePlace(_this.earth, place);
        }
      });
    });

    this.social.init(this.address);
  };

  airmaps.init = function (address) {
    if (typeof address === 'undefined') address = 'New York';

    google.earth.createInstance('map3d', function (object) {
      var ge = object;

      airmaps.ge = ge;

      // Set the basic options for ge
      ge.getOptions().setFlyToSpeed(100);
      ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN, true);
      ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);
      ge.getWindow().setVisibility(true);
      ge.getOptions().setMouseNavigationEnabled(false);

      if (airmaps.kinect) {
        airmaps.socket.init();
      }

      airmaps.initCity();
    });
  };

  window.airmaps = airmaps;

})(google);
