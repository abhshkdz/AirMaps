var getLatLng = function (geo, address) {
	var address = "New Delhi"
	$.ajax({
	  url:"http://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false",
	  type: "POST",
	  success: function(res){
	     console.log(res.results[0].geometry.location.lat);
	     console.log(res.results[0].geometry.location.lng);
	  }
	});
}