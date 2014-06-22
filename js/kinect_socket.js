(function (camera) {
  var socket = socket || {};

  socket.init = function (url) {
    socket.connection = new WebSocket(url);

    socket.connection.onopen = function () {
      // Handle initial connection here
      socket.connection.send('Connection Established Confirmation');
    };

    socket.connection.onmessage = function (event) {
      // Handle main logic here
      var data;
      var location;

      if (typeof event.data === Object) {
        data = event.data;
      } else {
        data = JSON.parse(event.data);
      }

      if (data.event === 'accelerate') {
        camera.accelerate(data.multiplier);
      }

      if (data.event === 'decelerate') {
        camera.decelerate(data.multiplier);
      }

      if (data.event === 'turn' || data.event === 'altitude') {
        camera.turn(data.direction);
      }

      if (data.event === 'location') {
        location = data.location.substring(7);
        camera.fly(location);
      }

      if (data.event === 'switch') {
        camera.change();
      }
    };

    socket.connection.onerror = function (event) {
      // Handle error events here
      alert('Web socket error');
    };

    socket.connection.onclose = function (event) {
      // Handle close event here
      alert('Web socket closed');
    };
  };

  window.socket = socket;

})(camera);
