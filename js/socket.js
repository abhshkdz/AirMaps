(function (airmaps) {
  'use strict';

  var socket = socket || {};

  socket.init = function (url) {
    var WebSocket = window.WebSocket || window.mozWebSocket;

    this._connection = new WebSocket(url);

    this._connection.onopen = function () {
      // Handle initial connection here
      socket.connection.send('Connection Established Confirmation');
    };

    this._connection.onmessage = function (event) {
      // Handle main logic here
      var data;

      if (typeof event.data === 'object') {
        data = event.data;
      } else {
        data = JSON.parse(event.data);
      }

      if (data.event === 'accelerate') {
        airmaps.camera.changeSpeed(data.multiplier);
      }

      if (data.event === 'decelerate') {
        airmaps.camera.changeSpeed(data.multiplier);
      }

      if (data.event === 'turn' || data.event === 'altitude') {
        airmaps.camera.turn(data.direction);
      }

      if (data.event === 'location') {
        airmaps.address = data.location.substring(7);
        airmaps.initCity();
      }

      if (data.event === 'switch') {
        airmaps.camera.change();
      }
    };

    this._connection.onerror = function (event) {
      // Handle error events here
      alert('Web socket error');
    };

    this._connection.onclose = function (event) {
      // Handle close event here
      alert('Web socket closed');
    };
  };

  airmaps.socket = socket;

})(airmaps);
