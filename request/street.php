<?php

  $lat = $_GET['lat'];
  $lng = $_GET['lng'];
  $heading = $_GET['heading'];
  $url = 'http://maps.googleapis.com/maps/api/streetview?size=1000x1000&' .
    'location=' . $lat .',' . $lng . '&heading=' . $heading . '&sensor=false';

  $image = file_get_contents($url);

  header("Content-Type: image/jpeg");
  echo $image;
