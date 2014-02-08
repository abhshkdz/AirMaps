<!doctype html>
<html>
<head>
	<title>Hello World!</title>
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<script type="text/javascript" src="https://www.google.com/jsapi"></script>
	<script src="js/jquery.js"></script>
	<script src="js/keyboard-focus-hack.js"></script>
	<script src="js/math3d.js"></script>
	<script src="js/game.js"></script>
	<script src="js/maps.js"></script>
	<script src="js/cam.js"></script>
	<script src="js/socket.js"></script>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body onload="init()" onkeydown="return keyDown(event)" onkeyup="return keyUp(event)" id="body" cz-shortcut-listen="true">
	<div id="map3d" style="width:80%;"></div>
	<div id="data" style="width:20%;">
		<div id="city"></div>
		<h2>Tweets from nearby places!</h2>
		<div id="tweets">Loading...</div>
	</div> 
	<script type="text/javascript">
		google.load("earth", "1");
		google.load("maps", "2");

		var ge = null;
		window.ge = null;
		var cam;

		function init() {
			window.adr = 'San Fransisco';
			window.total_count = 10;
			window.view = 'earth';
		  google.earth.createInstance("map3d", initCB, failureCB);
		}

		function initCB(object) {
		  ge = object;
		  window.ge = ge;
		  ge.getOptions().setFlyToSpeed(100);
		  conn = {}, window.WebSocket = window.WebSocket || window.MozWebSocket;
			var address = window.adr;
					$.ajax({
					  url:"http://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false",
					  type: "POST",
					  success: function(res){
					    var lat = res.results[0].geometry.location.lat;
					    var lng = res.results[0].geometry.location.lng;
					    ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);
					  	ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN, true);
							createCheckpoints(ge, 10, lat, lng, 0);
						  cam = new FirstPersonCam(lat, lng);
						  getNearbyPlaces(lat, lng, function (nearby) {
						  	for (var i in nearby) {
						  		var place = nearby[i];
						  		generatePlace(ge, place.latitude, place.longitude, place.name);
						  	}
						  });
						  cam.updateCamera();
						  $("#city").text("You are at "+address+" city");
			        		getTweets(address,function(tweets){
			        			$("#tweets").text("");
			        			for(var i in tweets){
			        				$("#tweets").append("<div class='tweet'>"+tweet[i].text+"</div>");
			        			}
			        		})
			        openConnection();
						  ge.getWindow().setVisibility(true);
						  // generateCheckpoint(ge, lat, lng, 100);
						  keyboardFocusHack(ge);
					  }
					});	
	
				window.reset = function() {
					var address = window.adr;
					$.ajax({
					  url:"http://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false",
					  type: "POST",
					  success: function(res){
					    var lat = res.results[0].geometry.location.lat;
					    var lng = res.results[0].geometry.location.lng;
							createCheckpoints(ge, 10, lat, lng, 0);
							delete cam;
						  cam = new FirstPersonCam(lat, lng);
						  cam.updateCamera();
						  getNearbyPlaces(lat, lng, function (nearby) {
						  	for (var i in nearby) {
						  		var place = nearby[i];
						  		generatePlace(ge, place.latitude, place.longitude, place.name);
						  	}
						  });
					  }
					});
		}

		  
		}

		function failureCB(object) {
		  /***
		   * This function will be called if plugin fails to load, in case
		   * you need to handle that error condition.
		   ***/
		   console.log(object);
		}

  </script>
</body>
</html>
