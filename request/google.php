<?php

  $lat = $_GET['lat'];
  $lng = $_GET['lng'];
  $key = 'AIzaSyAnBfpbJGNiAlh5TFu-V5UHglUEgK8DbzY';
  $url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
    . 'location=' . $lat . ',' . $lng . '&radius=10000&types=amusement_park|'
    . 'aquarium|art_gallery|city_hall|library|museum|place_of_worship|stadium|'
    . 'university|zoo&sensor=false&key=' . $key;

  if (isset($_GET['next_page_token'])) {
    $url .= '&next_page_token=' . $_GET['next_page_token'];
  }

  $response = file_get_contents($url);
  echo json_encode($response);
