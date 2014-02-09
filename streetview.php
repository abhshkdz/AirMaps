<?php
	$lat = $_GET['lat'];
	$lng = $_GET['lng'];
?>

<!doctype html>
<html>
<head>
	<title>Hello World!</title>
  <script type="text/javascript" src="https://www.google.com/jsapi"></script>
  <script src="js/jquery.js"></script>
  <script src="js/keyboard-focus-hack.js"></script>
  <script src="js/math3d.js"></script>
  <script src="js/game.js"></script>
  <script src="js/maps.js"></script>
  <script src="js/cam.js"></script>
</head>
<body style="width: 100%">
	<img id="mainimg" src="http://maps.googleapis.com/maps/api/streetview?size=1000x1000&location=<?=$lat?>,<?=$lng?>&fov=90&heading=0&pitch=10&sensor=false" style="margin: 0 auto; height: 1000px; width: 1000px;">
<script>

function fixAngle(a) {
  while (a < -180) {
    a += 360;
  }
  while (a > 180) {
    a -= 360;
  }
  return a;
}

conn = {};

function openConnection() {
    if (conn.readyState === undefined || conn.readyState > 1) {

        conn = new WebSocket('ws://172.17.6.68:8181');

        window.lat = <?= $lat ?>;
        window.lng = <?= $lng ?>;

        window.mainimg = document.getElementById('mainimg');
        window.heading = 0;
        conn.onopen = function () {
            conn.send("Connection Established Confirmation");
            console.log("Hello!");
        };

        conn.onmessage = function (event) {
          console.log(event.data);
            var data = JSON.parse(event.data);
            if (data.event === 'turn') {
              if (data.direction === 'left') {
                console.log('hello');
                window.heading = fixAngle(window.heading - 0.6);              
              } else if (data.direction === 'right') {
                window.heading = fixAngle(window.heading + 0.6);
                                console.log('hello');
              }
              window.mainimg.src = 'http://maps.googleapis.com/maps/api/streetview?size=500x500&location=' + window.lat + ',' + window.lng + '&fov=90&heading=' + window.heading + '&pitch=10&sensor=false';
            }
            else if (data.event === 'switch') {
                window.location.href ='index.php?lat=' + <?= $lat ?> + '&lng=' + <?= $lng ?>;
            }
        };

        conn.onerror = function (event) {
            alert("Web Socket Error");
        };


        conn.onclose = function (event) {
            alert("Web Socket Closed");
        };
    }
}

openConnection();
</script>
</body>
</html>

