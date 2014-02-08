var getNearbyPlaces = function (latitude, longitude, cb) {
	var key = "AIzaSyAnBfpbJGNiAlh5TFu-V5UHglUEgK8DbzY";
	$.ajax({
	  url:"/airsurf/request.php?lat="+ latitude + "&lng=" + longitude + "&key="+key,
	  type: "GET",
	  dataType: 'json',
	  success: function(res){
	  	// console.log(res);
	  	var jsonObject = JSON.parse(res);
	  	console.log(jsonObject);
	  	var results = jsonObject.results;
	  	var nearby = [];
	  	for(i=0; i< results.length; i++){
	  		var r = {};
	  		r.latitude  = results[i].geometry.location.lat;
	  		r.longitude = results[i].geometry.location.lng;
	  		r.name = results[i].name;
	  		r.reference = results[i].reference;
	  		nearby.push(r);
	  	}
	 	 	cb(nearby);
	  }
	});
}