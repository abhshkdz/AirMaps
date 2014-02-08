google.load("earth", "1", { "other_params": "sensor=false" });

function init() {
	google.earth.createInstance('map3d', initCB, failureCB);
}

function makeCircle(ge, centerLat, centerLng, radius) {

  var ring = ge.createLinearRing('');
  ring.setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);
  var steps = 25;
  var pi2 = Math.PI * 2;
  for (var i = 0; i < steps; i++) {
    var lat = centerLat + radius * Math.cos(i / steps * pi2);
    var lng = centerLng + radius * Math.sin(i / steps * pi2);
    ring.getCoordinates().pushLatLngAlt(lat, lng, 0);
  }
  return ring;
}

function createCirclePolygon(ge, centerLat, centerLng, radius) {
  var polygonPlacemark = ge.createPlacemark('');
  polygonPlacemark.setGeometry(ge.createPolygon(''));
  var outer = ge.createLinearRing('');
  polygonPlacemark.getGeometry().setOuterBoundary(makeCircle(ge, centerLat, centerLng, radius));
  polygonPlacemark.setName('placemark');
  ge.getFeatures().appendChild(polygonPlacemark);
}

function initCB(ge) {

	ge.getWindow().setVisibility(true);
	ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);
	ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
	ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN, true);
	ge.getLayerRoot().enableLayerById(ge.LAYER_TREES, true);
	ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, true);
	ge.getSun().setVisibility(true);

	var ring = createCircle(ge, {lat: 48.8, lng: -121.9, alt: 700}, 0.1);
	createPolygon(ge, ring);

	// // Get the current view.
	var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);

	// Set new latitude and longitude values.
	lookAt.setLatitude(48.7);
	lookAt.setLongitude(-121.754322);
	// Zoom out to twice the current range.
	lookAt.setRange(lookAt.getRange() * 0.025);
	// Update the view in Google Earth.
	ge.getView().setAbstractView(lookAt);

}
function failureCB(errorCode) {
	console.log(errorCode);
}

google.setOnLoadCallback(init);
