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

var travelmap;
var markerLatLong;
var addressLoc;
var coordOrig;
var coordDest;
var coordMid;
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
  markerLatLong = latLng;
}

function updateMarkerAddress(str) {
  document.getElementById('address').value = str;
  addressLoc = str;
}

function setDefaultUI() {
  // setting up the button names:
  document.getElementById('redobutton').onclick = initialize;
  document.getElementById('redobutton').title = dictionary.refresh;
  document.getElementById('directions').className = 'start';
  document.getElementById('uibar').className = 'start';
  document.getElementById('okaddress').value = dictionary.ok;
  document.getElementById('setin').onclick = setLoc;
  document.getElementById('setin').value = dictionary.setLoc;
}
  
function initialize() {
  setDefaultUI();
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
        updateMarkerPosition(marker.getPosition());        
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
        updateMarkerPosition(marker.getPosition());
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
        updateMarkerPosition(marker.getPosition());
      });
      
    } else {
      alert(dictionary.warngeocode + status);
    }
  });
}

function setLoc() {
  coordOrig = new google.maps.LatLng(markerLatLong.lat(),markerLatLong.lng());
  //startPoint = document.getElementById("address").value;
  startPoint = addressLoc;
  alert(dictionary.lat + markerLatLong.lat() + " " + dictionary.lng + markerLatLong.lng() + " " + dictionary.startloc + startPoint);
  if (document.getElementById('directions').className == 'start') { 
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
  if (document.getElementById('setin').onclick == setLoc) {
    document.getElementById('setin').onclick = setDest;
    document.getElementById('setin').value = dictionary.setDest;
    document.getElementById('redobutton').title = dictionary.resetLoc;
    document.getElementById('redobutton').onclick = reDoit;    
  };  
}

function setDest() {
  coordDest = new google.maps.LatLng(markerLatLong.lat(),markerLatLong.lng());
  //endPoint = document.getElementById("address").value;
  endPoint = addressLoc;
  //alert(dictionary.lat + markerLatLong.lat() + " " + dictionary.lng + markerLatLong.lng() + " Destination: " + endPoint);
  alert(dictionary.startloc + startPoint + " " + dictionary.destloc  + endPoint);
  if (document.getElementById('directions').className == 'end') {
    $('#directions').fadeOut("slow",
      function() {
        $('#uibar').animate({width:450, marginLeft: "150px"}, "slow");
        document.getElementById('directions').className = 'none';
        document.getElementById('redobutton').title = dictionary.resetDest;
    });  
  };
  resTravel();
}

function reDoit () {
  //reset The Start Location
  if (document.getElementById('directions').className == 'end') {
    $('#directions').fadeOut("slow", 
      function() { 
       setDefaultUI();
       $('#uibar').css({marginLeft: ""});
      });
    $('#directions').fadeIn("slow",
      function() {
      // Done it
      });     
   };
  //reset the destination
  if (document.getElementById('directions').className == 'none') {
    //$('#directions').fadeOut("slow");
    $('#uibar').animate({width:210,marginLeft: "270px"}, "slow", 
     function() {
       $('#directions').fadeIn("slow");
    });
    document.getElementById('setin').onclick = setDest;
    document.getElementById('directions').className = 'end';
    document.getElementById('redobutton').title = dictionary.resetLoc;
    //document.getElementById('uibar').className = 'end';    
  };
}

//coordMid = google.maps.geometry.spherical.interpolate(coordOrig,coordDest,0.5);
function resTravel() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var myOptions = {
    zoom:7,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: coordDest
  }
  map = new google.maps.Map(document.getElementById("map_dist"), myOptions);
  directionsDisplay.setMap(map);
  calcRoute();
}

var DirServ = new google.maps.DirectionsService(); 
function calcRoute() {
  var request = {
      origin:coordOrig, 
      destination:coordDest,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
  };        
  DirServ.route(request, function(response, status) {
    alert(status);
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  })
}

