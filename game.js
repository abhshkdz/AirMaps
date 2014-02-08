var changeSpeed = function (ge, speed) {
	if ( speed > 5.0 ) {
		speed = 5.0;
	}
	ge.getOptions().setFlyToSpeed(speed);
};

var changeZoom = function (ge, multiplier) {
	var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
	lookAt.setRange(lookAt.getRange() * 2.0);
	ge.getView().setAbstractView(lookAt);
};

var changeTilt = function (ge, tilt) {
	var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
	lookAt.setTilt(lookAt.getTilt() + tilt);
	ge.getView().setAbstractView(lookAt);
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
		var lng = centre.lng + radius * Math.sin(i / steps * pi);
		ring.getCoordinates().pushLatLngAlt(lat, lng, 700);
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
