var getNearbyPlaces = function (latitude, longitude, cb) {
	var key = "AIzaSyAnBfpbJGNiAlh5TFu-V5UHglUEgK8DbzY";
	$.ajax({
	  url:"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+ latitude + "," + longitude + "&radius=5000&types=amusement_park|aquarium|art_gallery|city_hall|library|museum|place_of_worship|stadium|university|zoo&sensor=false&key="+key,
	  type: "POST",
	  success: function(res){
	  	var jsonObject = JSON.parse(res);
	  	var results = jsonObject.results;
	  	var nearby = array();
	  	for(i=0; i< results.length; i++){
	  		var r = {};
	  		r.latitude  = nearby[i].geometry.location.lat;
	  		r.longitude = nearby[i].geometry.location.lng;
	  		r.name = nearby[i].name;
	  		r.reference = nearby[i].reference;
	  		nearby.push(r);
	  	}
	  cb(nearby);
	  }
	});
}