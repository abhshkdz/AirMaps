var getNearbyPlaces = function (latitude, longitude, cb) {
	var key = "AIzaSyAnBfpbJGNiAlh5TFu-V5UHglUEgK8DbzY";
	$.ajax({
	  url:"http://192.168.208.206/twitter/request.php?lat="+ latitude + "&lng=" + longitude + "&key="+key,
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

var getTweets = function(address, cb) {
	$.ajax({
	  url:"http://192.168.208.206/twitter/index.php?place="+ address.split(' ').join(''),
	  type: "GET",
	  dataType: 'json',
	  success: function(res){
	  	// console.log(res);
	  	//var jsonObject = JSON.parse(res);
	  	var html = '<ul>';
	  	for (var i in res.statuses)
	  	{
	  		console.log(res.statuses[i].text);
	  		html += '<li>' + res.statuses[i].text + '</li>';
	  	}
	  	html += '</ul>';
	  	$('#tweets').html(html);
	  	// var results = jsonObject.statuses;
	  	//  	cb(results);
	  }
	});
}