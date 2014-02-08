var changeSpeed = function (ge, speed) {
	if ( speed > 5.0 ) {
		speed = 5.0;
	}
	ge.getOptions().setFlyToSpeed(speed);
};

var changeLocation = function (ge, lat, lng) {
	var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
	lookAt.setLatitude(lat);
	lookAt.setLongitude(lng);
	ge.getView().setAbstractView(lookAt);
}

var createPolygon = function (ge, boundary, inner) {
	var polygonPlacemark = ge.createPlacemark('');
	var polygon = ge.createPolygon('');
	polygon.setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
	polygonPlacemark.setGeometry(polygon);
	polygon.setOuterBoundary(boundary);
	if (typeof inner !== 'undefined') {
		polygon.getInnerBoundaries().appendChild(inner);
	}
	ge.getFeatures().appendChild(polygonPlacemark);
}

var createCircle = function (ge, centre, radius) {
	var ring = ge.createLinearRing('');
	ring.setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
	var steps = 50;
	var pi = Math.PI * 2;
	for (var i = 0; i < steps; i++) {
		var lat = centre.lat + radius * Math.cos(i / steps * pi);
		var alt = centre.alt + radius + Math.sin(i / steps * pi);
		ring.getCoordinates().pushLatLngAlt(lat, -121.9, alt);
	}
	return ring;
}

var createBoundary = function (ge, points) {
	var boundary = ge.createLinearRing('');
	boundary.setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
	for (var i in points) {
		var point = points[i];
		boundary.getCoordinates().pushLatLngAlt(point.lat, point.lng, point.alt);
	}
	return boundary;
}


var generateCheckpoints = function (ge,lat,lng,alt) {
	ge.getWindow().setVisibility(true);
    ge.getNavigationControl().setVisibility(ge.VISIBILITY_SHOW);
    var checkPoint = ge.createPlacemark('');
    var icon = ge.createIcon('');
    	icon.setHref('icon.png');
    var style = ge.createStyle('');
		style.getIconStyle().setIcon(icon);
		checkPoint.setStyleSelector(style);
    var point = ge.createPoint('');
    point.setLatitude(lat);
    point.setLongitude(lng);
    point.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
    point.setAltitude(alt);
    checkPoint.setGeometry(point);
    checkPoint.setName("Catch It baby");
    ge.getFeatures().appendChild(checkPoint);

};

var initializeGame = function (ge) {
	var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
	lookAt.setLatitude(48.7);
	lookAt.setLongitude(-121.754322);
	lookAt.setRange(lookAt.getRange() * 0.0005);
	lookAt.setTilt(60.0);
	ge.getView().setAbstractView(lookAt);
	// var camera = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);
	// camera.setRoll(60.0);
	// ge.getView().setAbstractView(camera);
	// Create a stack of rings
	// Display the current ring
	// Display arrow pointing towards current ring
	var speed = 3.0;
	var default_speed_multiplier = 0.0025;
	// var gameloop = setInterval(function () {
	// 	// All event listeners for kinect are added here
	// 	// Get the camera moving
	// 	var camera = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);
	// 	var roll = camera.getRoll();
	// 	console.log(roll);
	// 	// moveCamera(ge, { lat: default_speed_multiplier * Math.sin(Math.PI * roll / 180), lng: default_speed_multiplier * Math.sin(Math.PI * roll / 180), zoom: 0 });
	// 	// Detect whether ring co-ordinates similar to current
	// }, 1000);
};