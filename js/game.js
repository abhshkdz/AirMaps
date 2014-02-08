var rings = [];
var current_ring = 0;

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

var generateCheckpoint = function (ge, lat, lng, alt) {
  var checkPoint = ge.createPlacemark('');
  checkPoint.setName("Testing here");
  var icon = ge.createIcon('');
	icon.setHref('icon.png');
  var style = ge.createStyle('');
	style.getIconStyle().setIcon(icon);	
	style.getIconStyle().setScale(10.0);
	checkPoint.setStyleSelector(style);
  var point = ge.createPoint('');
  point.setLatitude(lat);
  point.setLongitude(lng);
  point.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
  point.setAltitude(alt);
  checkPoint.setGeometry(point);
  ge.getFeatures().appendChild(checkPoint);
};

var createCheckpoints = function (ge, count, lat, lng, alt) {
	var ref = [lat, lng, 250];
	for (var i = 0; i < count; i++) {
		rings[i] = [];
		for (var j = 0; j < 2; j++) {
			rings[i][j] = ref[j] + Math.random() * 2 - 1.0;
		}
		rings[i][2] = ref[2] + ( Math.random() * 200 ) - 100;
		if (rings[i][2] < 0) {
			rings[i][2] = 250;
		}
		ref = rings[i];
	}
	current_ring = 0;
	generateCheckpoint(ge, rings[current_ring][0], rings[current_ring][1], 100);
};

var in_range = function (x, y, flag) {
	var t = y - x;
	if (t < 0) { t = -t; }
	if (flag) {
		return t < 0.5;		
	} else {
		return t < 25;
	}
}

var checkPresence = function (ge) {
	var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
	var lat = lookAt.getLatitude();
	var lng = lookAt.getLongitude();
	// console.log(lat);console.log(lng)/;
	return in_range(lat, rings[current_ring][0], true) && in_range(lng, rings[current_ring][1], true);// && in_range(person[2], rings[current_ring][2], false);
}
