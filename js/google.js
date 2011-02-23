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
var startPoint;
var endPoint;
function geocodePosition(pos) {
  geocoder.geocode({
    latLng: pos
  }, function(responses) {
    if (responses && responses.length > 0) {
      updateMarkerAddress(responses[0].formatted_address);
    } else {
      updateMarkerAddress(dictionary.errorgeoloc );
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
  // setting up the button names:
  if (!document.getElementById('directions').className) {
    document.getElementById('directions').className = 'start';
  };
  if (!document.getElementById('uibar').className) {
    document.getElementById('uibar').className = 'start';
  };    
  if (!document.getElementById('okaddress').value) {
    document.getElementById('okaddress').value = dictionary.ok;
  }
  if (!document.getElementById('setin').onclick) {
    document.getElementById('setin').onclick = setLoc;
    document.getElementById('setin').value = dictionary.setLoc;
  };
  
  //maps part:
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
    contentString = dictionary.errorgeoloc;
  } else {
    initialLocation = siberia;
    contentString = dictionary.errorsiberia;
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
      // There might be a better way to remove just the Marker without redraw the map...
      // but I can't find it right now...
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
        geocodePosition(marker.getPosition());
      });
      
    } else {
      alert(dictionary.warngeocode + status);
    }
  });
}

function setLoc() {
  startPoint = document.getElementById("address").value;
  alert(dictionary.lat + markerLatLong.lat() + " " + dictionary.lng + markerLatLong.lng() + " " + dictionary.startloc + startPoint);
  if (document.getElementById('directions').className = 'start') { 
    $('#directions').fadeOut("slow", 
      function() {
        document.getElementById('directions').className = 'end';
        document.getElementById('uibar').className = 'end';
    });
    $('#directions').fadeIn("slow",

      function() {
        //Finished
    });
  };
  if (document.getElementById('setin').onclick = setLoc) {
    document.getElementById('setin').onclick = setDest;
    document.getElementById('setin').value = dictionary.setDest;
  };  
}

function setDest() {
  endPoint = document.getElementById("address").value;
  //alert(dictionary.lat + markerLatLong.lat() + " " + dictionary.lng + markerLatLong.lng() + " Destination: " + endPoint);
  alert(dictionary.startloc + startPoint + " " + dictionary.destloc  + endPoint);
  if (document.getElementById('directions').className = 'end') {
    $('#directions').fadeOut("slow",
      function() {
        document.getElementById('uibar').className = 'larger';
        $('#uibar').animate({width:450}, "slow");
        document.getElementById('directions').className = 'none';
    });  
  };
}

function animateUibar () {
 $('#uibar').animate({"left": "+=90px"}, "slow");
}

