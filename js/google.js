var initialLocation;
var siberia = new google.maps.LatLng(60, 105);
var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
var browserSupportFlag =  new Boolean();
var geocode;
var map;
var infowindow = new google.maps.InfoWindow();
var rendererOptions = {
  draggable: true
};
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
var directionsService = new google.maps.DirectionsService();
var markerLatLong;
var markerAddrs;

function geocodePosition(pos) {
  geocoder.geocode({
    latLng: pos
  }, function(responses) {
    if (responses && responses.length > 0) {
      updateMarkerAddress(responses[0].formatted_address);
    } else {
      updateMarkerAddress('Cannot determine address at this location.');
    }
  });
}

function updateMarkerPosition(latLng) {
  markerLatLong= latLng;
}

function updateMarkerAddress(str) {
  document.getElementById('address').value = str;
}
  
function initialize() {
  geocoder = new google.maps.Geocoder();
  var myOptions = {
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  // Try W3C Geolocation method (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
      var marker = new google.maps.Marker({
        map: map,
        draggable:true,
        animation: google.maps.Animation.DROP,
        position: initialLocation,
      });
      // Update current position info.
      updateMarkerPosition(initialLocation);
      geocodePosition(initialLocation);
      google.maps.event.addListener(marker, 'dragend', function() {
        //updateMarkerStatus('Drag ended');
        geocodePosition(marker.getPosition());
      });
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  } else if (google.gears) {
    // Try Google Gears Geolocation
    browserSupportFlag = true;
    var geo = google.gears.factory.create('beta.geolocation');
    geo.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
      map.setCenter(initialLocation);
      var marker = new google.maps.Marker({
        map: map,
        draggable:true,
        animation: google.maps.Animation.DROP,
        position: initialLocation,
      });
      // Update current position info.
      updateMarkerPosition(initialLocation);
      geocodePosition(initialLocation);
      google.maps.event.addListener(marker, 'dragend', function() {
        //updateMarkerStatus('Drag ended');
        geocodePosition(marker.getPosition());
      });
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  } else {
    // Browser doesn't support Geolocation
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag == true) {
    initialLocation = newyork;
    contentString = "Error: The Geolocation service failed.";
  } else {
    initialLocation = siberia;
    contentString = "Error: Your browser doesn't support geolocation. Are you in Siberia?";
  }
  map.setCenter(initialLocation);
}

function codeAddress() {
  var address = document.getElementById("address").value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var myOptions = {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          draggable:true,
          animation: google.maps.Animation.DROP,
          position: results[0].geometry.location
      });
      // Update current position info.
      updateMarkerPosition(results[0].geometry.location);
      geocodePosition(results[0].geometry.location);
      google.maps.event.addListener(marker, 'dragend', function() {
        //updateMarkerStatus('Drag ended');
        geocodePosition(marker.getPosition());
      });
      
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function setLoc() {
  alert("Lat: " + markerLatLong.lat() + " Long " + markerLatLong.lng() + " Address: " + document.getElementById("address").value );
}

