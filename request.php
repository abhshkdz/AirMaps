<?php

	$lat = $_GET['lat'];
	$lng = $_GET['lng'];
	$key = $_GET['key'];
	$url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=$lat,$lng&radius=5000&types=amusement_park|aquarium|art_gallery|city_hall|library|museum|place_of_worship|stadium|university|zoo&sensor=false&key=$key";
	$res = file_get_contents($url);
	echo json_encode($res);


?>