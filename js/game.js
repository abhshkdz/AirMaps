window.rings = [];
window.current_ring = 0;

var generatePlace = function (ge, lat, lng, name) {
	console.log(name);
	var checkPoint = ge.createPlacemark('');
	checkPoint.setName(name);
  var point = ge.createPoint('');
  point.setLatitude(lat);
  point.setLongitude(lng);
  checkPoint.setGeometry(point);
  var icon = ge.createIcon('');
	icon.setHref('http://maps.google.com/mapfiles/kml/paddle/red-circle.png');
  var style = ge.createStyle('');
	style.getIconStyle().setIcon(icon);	
	style.getIconStyle().setScale(2.0);
	checkPoint.setStyleSelector(style);
  ge.getFeatures().appendChild(checkPoint);
};

var generateCheckpoint = function (ge, lat, lng, alt) {
  var checkPoint = ge.createPlacemark('');
  checkPoint.setName("Testing here");
 //  var icon = ge.createIcon('');
	// icon.setHref('http://maps.google.com/mapfiles/kml/paddle/red-circle.png');
 //  var style = ge.createStyle('');
	// style.getIconStyle().setIcon(icon);	
	// style.getIconStyle().setScale(10.0);
	// checkPoint.setStyleSelector(style);
  var point = ge.createPoint('');
  console.log(lat);
  console.log(lng);
  point.setLatitude(lat);
  point.setLongitude(lng);
  point.setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
  point.setAltitude(alt);
  checkPoint.setGeometry(point);
  ge.getFeatures().appendChild(checkPoint);
};

var createCheckpoints = function (ge, count, lat, lng, alt) {
	var ref = [lat, lng, 250];
	window.current_ring = 0;
	for (var i = 0; i < count; i++) {
		window.rings[i] = [];
		for (var j = 0; j < 2; j++) {
			window.rings[i][j] = ref[j] + Math.random() * 0.02 - 0.01;
		}
		window.rings[i][2] = ref[2] + ( Math.random() * 50 ) - 25;
		if (window.rings[i][2] < 0) {
			window.rings[i][2] = 250;
		}
		ref = window.rings[i];
	}
    generateCheckpoint(ge, window.rings[window.current_ring][0], window.rings[window.current_ring][1], 100);
		// window.current_ring++;
};
