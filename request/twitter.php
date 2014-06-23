<?php

  if (file_exists('twitter_cache.json')) {
    exit(json_encode(file_get_contents('twitter_cache.json'));
  }

  echo 'yolo';
