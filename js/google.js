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
  //hide text, end and track icons:
  $('#endicon').hide();
  $('#start2end').hide();
  $('#textdist').hide();
  $('#uibar').hide();
}

var tipOpts = {
  clickAnywhereToClose: false,
  positions: 'top',
  trigger: 'none',
  width: 200,
  centerPointX: .5,
  spikeLength: 5,
  spikeGirth: 10,
  padding: 10,
  cornerRadius: 25,
  fill: '#FFF',
  strokeStyle: '#ABABAB',
  strokeWidth: 1,
  shadow: true,
  shadowOffsetX: 3,
  shadowOffsetY: 3,
  shadowBlur: 8,
  shadowColor: 'rgba(0,0,0,.9)',
  shadowOverlap: false,
  noShadowOpts: {strokeStyle: '#999', strokeWidth: 2},
  noShadowOpts: {strokeStyle: '#999', strokeWidth: 2}
};
  
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
  $('#startpin').bt(startPoint,tipOpts);
  //alert(dictionary.lat + markerLatLong.lat() + " " + dictionary.lng + markerLatLong.lng() + " " + dictionary.startloc + startPoint);
  if (document.getElementById('directions').className == 'start') {
    $('#helpui').slideUp("slow");
    $('#directions').fadeOut("slow", 
      function() {
        document.getElementById('directions').className = 'end';
        document.getElementById('uibar').className = 'end';
    });
    $('#directions').fadeIn("slow",
      function() {
       $('#uibar').fadeIn("slow",
         function() {
           $('#startpin').btOn();
       });
        //Finished        
    });
  };
  if (document.getElementById('setin').onclick == setLoc) {
    document.getElementById('setin').onclick = setDest;
    document.getElementById('setin').value = dictionary.setDest;
    document.getElementById('redobutton').title = dictionary.resetLoc;
    document.getElementById('redobutton').onclick = reDoit;    
  };
  if (coordDest) {
    geocodePosition(coordDest);
  };  
}

function setDest() {
  coordDest = new google.maps.LatLng(markerLatLong.lat(),markerLatLong.lng());
  //endPoint = document.getElementById("address").value;
  endPoint = addressLoc;
  if (endPoint == startPoint) {
    //break;
    return false;
  }
  $('#endpin').bt(endPoint,tipOpts);    
  //alert(dictionary.lat + markerLatLong.lat() + " " + dictionary.lng + markerLatLong.lng() + " Destination: " + endPoint);
  //alert(dictionary.startloc + startPoint + " " + dictionary.destloc  + endPoint);  
  
  if (document.getElementById('directions').className == 'end') {
    $('#directions').fadeOut("slow",
      function() {
        $('#startpin').btOff();
        $('#uibar').animate({width:450, marginLeft: "150px"}, "slow");
        document.getElementById('directions').className = 'none';
        document.getElementById('redobutton').title = dictionary.resetDest;
        //animate and unhide the icons:
        $('#start2end').show().animate({width:200},"slow",
          function() {
            $('#endicon').fadeIn("slow",
             function() {
              $('#textdist').show();
              $('#startpin').btOn();
              $('#endpin').btOn();
            });
        });
    });  
  };
  resTravel(coordOrig,coordDest);
    
  //document.getElementById('startpin').className = 'bt-active'

  //alert($('#startpin').hasClass('bt-active'))

}

function reDoit () {
  //reset The Start Location
  if (document.getElementById('directions').className == 'end') {
    $('#startpin').btOff();
    $('#directions').fadeOut("slow", 
      function() { 
       setDefaultUI();
       $('#uibar').css({marginLeft: ""});
      });
    geocodePosition(coordOrig);
    $('#directions').fadeIn("slow",
      function() {
      $('#helpui').slideDown("slow");
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
    geocodePosition(coordDest);
    document.getElementById('setin').onclick = setDest;
    document.getElementById('directions').className = 'end';
    document.getElementById('redobutton').title = dictionary.resetLoc;
    //document.getElementById('uibar').className = 'end';
    //hide text, end and track icons:
    $('#endicon').fadeOut("fast");
    $('#start2end').animate({width:20},
     function() {
      $('#start2end').hide();
    });
    $('#textdist').hide();
    $('#startpin').btOff();
    $('#endpin').btOff();   
  };
}

//coordMid = google.maps.geometry.spherical.interpolate(coordOrig,coordDest,0.5);
var travelmap;
var rendererOptions;
var dirDisplay;
var DirServ;

function resTravel(org,dst) {
  rendererOptions = {
    draggable: true
  };
  dirDisplay = new google.maps.DirectionsRenderer(rendererOptions);
  DirServ = new google.maps.DirectionsService(); 
  var myOptionsRes = {
    zoom:7,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: org
  }
  travelmap = new google.maps.Map(document.getElementById("map_canvas2"), myOptionsRes);
  dirDisplay.setMap(travelmap);
  google.maps.event.addListener(dirDisplay, 'directions_changed', function() {
     // computeTotalDistance(dirDisplay.directions);
     var lastdata = computeDiffTracks(dirDisplay.directions);
     document.getElementById("textdist").innerHTML = lastdata.total + " km";
     //update the baloons
      $('#startpin').btOff();
      $('#endpin').btOff();
      $('#startpin').bt(lastdata.start,tipOpts);
      $('#endpin').bt(lastdata.end,tipOpts);
      $('#startpin').btOn();
      $('#endpin').btOn();
     //done... next we have to put the final values into a DB... 
    }
  );
  var request = {
      origin: org,
      destination:dst,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
  };
  DirServ.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      dirDisplay.setDirections(response);
    }
  })
}

function computeDiffTracks(result) {
  var newdata = new Array(3);
  newdata.total = 0;
  var myroute = result.routes[0];
  for (i = 0; i < myroute.legs.length; i++) {
    newdata.total += myroute.legs[i].distance.value;
    if (i == 0) {
      newdata.start = myroute.legs[i].start_address;
    }
    if (i == (myroute.legs.length - 1)) {
      newdata.end = myroute.legs[i].end_address;
    }
  }
  //for (j = 0; j < myroute.overview_path.length; j++) {
  // alert(myroute.overview_path[j]);
  //}
  newdata.total = newdata.total / 1000;
  return(newdata);
}


