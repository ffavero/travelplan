/*
 GoogleMap functions built on top of jquery and jquery-ui
 
 Came from an aggressive copy/paste so have to be revisited
*/

// Variables, need to clean up a little
var initialLocation;
var siberia = new google.maps.LatLng(60, 105);
var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
var browserSupportFlag =  new Boolean();
var geocode;
var map;
var infowindow = new google.maps.InfoWindow();
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
 },
 function(responses) {
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
 $('#address').val(str);
 addressLoc = str;
}

function initMap() {
 //maps part:
 geocoder = new google.maps.Geocoder();
 var myOptions = {
  zoom: 10,
  mapTypeId: google.maps.MapTypeId.ROADMAP
 };
 map = new google.maps.Map($('#map_canvas').get(0), myOptions);
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
 /* attempt to make a autocomplete Address input
 Works but maybe have to be revisited...(just copied/pasted from somewhere) */
  
 $('#address').autocomplete({
  source: function(request, response) {
   if (geocoder == null){
    geocoder = new google.maps.Geocoder();
   } 
   geocoder.geocode( {'address': request.term }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
     var searchLoc = results[0].geometry.location;
     var lat = results[0].geometry.location.lat();
     var lng = results[0].geometry.location.lng();
     var latlng = new google.maps.LatLng(lat, lng);
     var bounds = results[0].geometry.bounds;
     geocoder.geocode({'latLng': latlng}, function(results1, status1) {
      if (status1 == google.maps.GeocoderStatus.OK) {
       if (results1[1]) {
        response($.map(results1, function(loc) {
         return {
          label  : loc.formatted_address,
          value  : loc.formatted_address,
          bounds   : loc.geometry.bounds
         }
        }));
       }
      }
     });
    }
   });
  },
  select: function(event,ui){
   var pos = ui.item.position;
   var lct = ui.item.locType;
   var bounds = ui.item.bounds;
   if (bounds){
    map.fitBounds(bounds);
   }
  }
 });  
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
 var address = $('#address').val();
 geocoder.geocode( {'address': address}, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
   var myOptions = {
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
   };
   // There might be a better way to remove just the Marker without redraw the map...
   // but I can't find it right now...
   map = new google.maps.Map($('#map_canvas').get(0), myOptions);
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
