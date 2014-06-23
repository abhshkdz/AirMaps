(function (google, airmaps) {
  'use strict';

  var camera = camera || {};

  // Keep an angle in [-180,180]
  function fixAngle(a) {
    while (a < -180) {
      a += 360;
    }
    while (a > 180) {
      a -= 360;
    }
    return a;
  }

  camera.directions = {
    turnLeft: false,
    turnRight: false,
    tiltUp: false,
    tiltDown: false,
    moveForward: true,
    moveBackward: false,
    strafeLeft: false,
    strafeRight: false,
    altitudeUp: false,
    altitudeDown: false
  };

  camera.speeds = {
    turnSpeed: 60.0,
    tiltSpeed: 150.0,
    strafeVelocity: 30.0,
    forwardVelocity: 100.0
  };

  camera.position = {
    lat: 0.0,
    lng: 0.0,
    alt: 200
  };

  camera._listenerAdded = false;

  camera.keyDown = function (event) {
    if (!event) {
      event = window.event;
    }
    if (event.keyCode == 33) {  // Altitude Up
      this.directions.altitudeUp = true;
      event.returnValue = false;
    } else if (event.keyCode == 34) {  // Altitude Down
      this.directions.altitudeDown = true;
      event.returnValue = false;
    } else if (event.keyCode == 37) {  // Turn Left.
      this.directions.turnLeft = true;
      event.returnValue = false;
    } else if (event.keyCode == 39) {  // Turn Right.
      this.directions.turnRight = true;
      event.returnValue = false;
    } else if (event.keyCode == 38) {  // Tilt Up.
      this.directions.tiltUp = true;
      event.returnValue = false;
    } else if (event.keyCode == 40) {  // Tilt Down.
      this.directions.tiltDown = true;
      event.returnValue = false;
    } else if (event.keyCode == 65 ||
               event.keyCode == 97) {  // Strafe Left.
      this.directions.strafeLeft = true;
      event.returnValue = false;
    } else if (event.keyCode == 68 ||
               event.keyCode == 100) {  // Strafe Right.
      this.directions.strafeRight = true;
      event.returnValue = false;
    } else if (event.keyCode == 87 ||
               event.keyCode == 119) {  // Move Forward.
      this.directions.moveForward = true;
      event.returnValue = false;
    } else if (event.keyCode == 83 ||
               event.keyCode == 115) {  // Move Forward.
      this.directions.moveBackward = true;
      event.returnValue = false;
    } else {
      return true;
    }
    return false;
  }

  camera.keyUp = function (event) {
    if (!event) {
      event = window.event;
    }
    if (event.keyCode == 33) {  // Altitude Up
      this.directions.altitudeUp = false;
      event.returnValue = false;
    } else if (event.keyCode == 34) {  // Altitude Down
      this.directions.altitudeDown = false;
      event.returnValue = false;
    } else if (event.keyCode == 37) {  // Left.
      this.directions.turnLeft = false;
      event.returnValue = false;
    } else if (event.keyCode == 39) {  // Right.
      this.directions.turnRight = false;
      event.returnValue = false;
    } else if (event.keyCode == 38) {  // Up.
      this.directions.tiltUp = false;
      event.returnValue = false;
    } else if (event.keyCode == 40) {  // Down.
      this.directions.tiltDown = false;
      event.returnValue = false;
    } else if (event.keyCode == 65 ||
               event.keyCode == 97) {  // Strafe Left.
      this.directions.strafeLeft = false;
      event.returnValue = false;
    } else if (event.keyCode == 68 ||
               event.keyCode == 100) {  // Strafe Right.
      this.directions.strafeRight = false;
      event.returnValue = false;
    } else if (event.keyCode == 87 ||
               event.keyCode == 119) {  // Move Forward.
      this.directions.moveForward = false;
      event.returnValue = false;
    } else if (event.keyCode == 83 ||
               event.keyCode == 115) {  // Move Forward.
      this.directions.moveBackward = false;
      event.returnValue = false;
    }
    return false;
  }


  camera.changeSpeed = function (multiplier) {
    var maxForwardVelocity = 500;
    var minForwardVelocity = 100;

    this.speeds.forwardVelocity *= multiplier;
    if (this.speeds.forwardVelocity > maxForwardVelocity) {
      this.speeds.forwardVelocity = maxForwardVelocity;
    } else if (this.speeds.forwardVelocity < minForwardVelocity) {
      this.speeds.forwardVelocity = minForwardVelocity;
    }
  };

  camera.init = function (lat, lng) {
    var me = this;

    // The anchor point is where the camera is situated at. We store
    // the current position in lat, lon, altitude and in cartesian
    // coordinates.
    me.localAnchorLla = [lat, lng, 0];  // San Francisco
    me.localAnchorCartesian = V3.latLonAltToCartesian(me.localAnchorLla);

    // Heading, tilt angle is relative to local frame
    me.headingAngle = 0;
    me.tiltAngle = 0;

    // Initialize the time
    me.lastMillis = (new Date()).getTime();

    // Used for bounce.
    me.distanceTraveled = 0;

    // Updates should be called on frameend to help keep objects in sync.
    // GE does not propogate changes caused by KML objects until an
    // end of frame.
    if (!me._listenerAdded) {
      me._listenerAdded = true;
      google.earth.addEventListener(airmaps.ge, "frameend",
        function() { me.update(); });
    }

    me.update();
  };

  camera.updateOrientation = function (dt) {
    var me = this;

    // Based on dt and input press, update turn angle.
    if (me.directions.turnLeft || me.directions.turnRight) {
      var turnSpeed = me.speeds.turnSpeed; // radians/sec
      if (me.directions.turnLeft)
        turnSpeed *= -1.0;
      me.headingAngle += turnSpeed * dt * Math.PI / 180.0;
    }
    if (me.directions.tiltUp || me.directions.tiltDown) {
      var tiltSpeed = me.speeds.tiltSpeed; // radians/sec
      if (me.directions.tiltDown)
        tiltSpeed *= -1.0;
      me.tiltAngle = me.tiltAngle + tiltSpeed * dt * Math.PI / 180.0;
      // Clamp
      var tiltMax = 50.0 * Math.PI / 180.0;
      var tiltMin = -90.0 * Math.PI / 180.0;
      if (me.tiltAngle > tiltMax)
        me.tiltAngle = tiltMax;
      if (me.tiltAngle < tiltMin)
        me.tiltAngle = tiltMin;
    }
  };

  camera.updatePosition = function (dt) {
    var me = this;

    // Convert local lat/lon to a global matrix. The up vector is
    // vector = position - center of earth. And the right vector is a vector
    // pointing eastwards and the facing vector is pointing towards north.
    var localToGlobalFrame = M33.makeLocalToGlobalFrame(me.localAnchorLla);

    // Move in heading direction by rotating the facing vector around
    // the up vector, in the angle specified by the heading angle.
    // Strafing is similar, except it's aligned towards the right vec.
    var headingVec = V3.rotate(localToGlobalFrame[1], localToGlobalFrame[2],
                               -me.headingAngle);
    var rightVec = V3.rotate(localToGlobalFrame[0], localToGlobalFrame[2],
                               -me.headingAngle);
    // Calculate strafe/forwards
    var strafe = 0;
    if (me.directions.strafeLeft || me.directions.strafeRight) {
      var strafeVelocity = me.speeds.strafeVelocity;
      if (me.directions.strafeLeft)
        strafeVelocity *= -1;
      strafe = strafeVelocity * dt;
    }
    var forward = 0;
    if (me.directions.moveForward || me.directions.moveBackward) {
      var forwardVelocity = me.speeds.forwardVelocity;
      if (me.directions.moveBackward)
        forwardVelocity *= -1;
      forward = forwardVelocity * dt;
    }
    if (me.directions.altitudeUp) {
      me.position.alt += 1.0;
    } else if (me.directions.altitudeDown) {
      me.position.alt -= 1.0;
    }
    me.position.alt = Math.max(0, me.position.alt);

    me.distanceTraveled += forward;

    // Add the change in position due to forward velocity and strafe velocity
    me.localAnchorCartesian = V3.add(me.localAnchorCartesian,
                                     V3.scale(rightVec, strafe));
    me.localAnchorCartesian = V3.add(me.localAnchorCartesian,
                                     V3.scale(headingVec, forward));

    // Convert cartesian to Lat Lon Altitude for camera setup later on.
    me.localAnchorLla = V3.cartesianToLatLonAlt(me.localAnchorCartesian);
  };

  camera.updateCamera = function () {
    var me = this;
    var lla = me.localAnchorLla;
    lla[2] = airmaps.ge.getGlobe().getGroundAltitude(lla[0], lla[1]);

    // Will put in a bit of a stride if the camera is at or below 1.7 meters
    var bounce = 0;
    if (me.position.alt <= 1.7) {
      bounce = 1.5 * Math.abs(Math.sin(4 * me.distanceTraveled *
                                       Math.PI / 180));
    }

    // Update camera position. Note that tilt at 0 is facing directly downwards.
    //  We add 90 such that 90 degrees is facing forwards.
    var la = airmaps.ge.createLookAt('');
    la.set(me.localAnchorLla[0], me.localAnchorLla[1],
           me.position.alt + bounce,
           airmaps.ge.ALTITUDE_RELATIVE_TO_GROUND,
           fixAngle(me.headingAngle * 180 / Math.PI), /* heading */
           me.tiltAngle * 180 / Math.PI + 90, /* tilt */
           0 /* altitude is constant */
           );

    airmaps.ge.getView().setAbstractView(la);
  };

  camera.update = function () {
    var me = this;

    airmaps.ge.getWindow().blur();

    // Update delta time (dt in seconds)
    var now = (new Date()).getTime();
    var dt = (now - me.lastMillis) / 1000.0;
    if (dt > 0.25) {
      dt = 0.25;
    }
    me.lastMillis = now;

    // Update orientation and then position  of camera based
    // on user input
    me.updateOrientation(dt);
    me.updatePosition(dt);
    // Update camera
    me.updateCamera();
  };

  airmaps.camera = camera;

})(google, airmaps);
