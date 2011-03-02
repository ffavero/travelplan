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
  //show the useful hidden things
  $('#address').show();
  $('#okaddress').show();
  $('#setin').show();  
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
  
  /* attempt to make a autocomplete Address input
   Works but maybe have to be revisited...(just copied/pasted from somewhere) */
  
  $("#address").autocomplete({
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
 /* */  
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
  $('#resbar').fadeOut("fast");
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
              $('#resbar').slideDown("slow");
            });
        });
    });  
  };
  resTravel(coordOrig,coordDest);
  document.getElementById('showmap').src= '/themes/default/images/google-maps.png';
  document.getElementById('tripdetails').src= '/themes/default/images/travelnote.png';
  document.getElementById('travelissok').src= '/themes/default/images/ok.png';
  
  document.getElementById('showmap').title= dictionary.lookMap ;
  document.getElementById('tripdetails').title= dictionary.lookDetails;
  document.getElementById('travelissok').title= dictionary.travelOk;
  
  document.getElementById('showmap').onclick= showhideMap;
  document.getElementById('tripdetails').onclick= showhideDetails;
  document.getElementById('travelissok').onclick= saveAndSearch;    
  //document.getElementById('startpin').className = 'bt-active'

  //alert($('#startpin').hasClass('bt-active'))

}

function saveAndSearch() {

 //collect all the mess we've done around.. for now
 // needs: userid(dummy for now) ,time, orig latlan, dest latlan, array of all latlans,
 //  if by car or not, how many places in the car....
 // userid : dummy
 // orig = coorOrig ->  in lastdata as a lot of others
 // dest = coorDest
 // latlans... from overview.. (still to to)
 // time.. from time var (still to imporove)
  
  //now just debug lat anf lng of the overview...
 var resVect = '';
 alert ("Debugging longitude");
 for (j = 0; j < lastdata.overview.length ; j++) {
  resVect = resVect + " " + lastdata.overview[j].lng().toFixed(3)
 } 
 alert(resVect);
}

function showhideMap() {
  if($('#map_canvas2').is(":visible")) {
   $('#map_canvas2').slideUp('slow');
  } else {
   if ($('#dirpanel').is(":visible")) {
     $('#dirpanel').hide();
   }
   $('#map_canvas2').slideDown('slow',
   function() {
   //can't (lazy) find out a better solution...
    resTravel(coordOrig,coordDest);
   });
  }
}

function showhideDetails() {
  if($('#dirpanel').is(":visible")) {
   $('#dirpanel').slideUp('slow');
  } else {
   if ($('#map_canvas2').is(":visible")) {
     $('#map_canvas2').hide();
   }
   $('#dirpanel').empty(); // otherwise appends new track to the old one...
   resTravel(coordOrig,coordDest);     
   //$('#dirpanel').slideDown('slow');
   $('#dirpanel').dialog({
    width: 460,
    draggable: false
    });
  }
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
    $('#resbar').slideUp("slow");
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
    $('#textdist').hide();
    $('#startpin').btOff();
    $('#endpin').btOff();    
    $('#start2end').animate({width:0}, "slow",
     function() {
      $('#start2end').hide('normal',
        function() {
          $('#startpin').btOn();
      });
    });   
  };
}

//coordMid = google.maps.geometry.spherical.interpolate(coordOrig,coordDest,0.5);
var travelmap;
var rendererOptions;
var dirDisplay;
var DirServ;
var lastdata;
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
  dirDisplay.setPanel(document.getElementById("dirpanel"));
  google.maps.event.addListener(dirDisplay, 'directions_changed', function() {
     // computeTotalDistance(dirDisplay.directions);
     lastdata = computeDiffTracks(dirDisplay.directions);
     document.getElementById("textdist").innerHTML = lastdata.total + " km";
     //update the baloons
      $('#startpin').btOff();
      $('#endpin').btOff();
      $('#startpin').bt(lastdata.start,tipOpts);
      $('#endpin').bt(lastdata.end,tipOpts);
      $('#startpin').btOn();
      $('#endpin').btOn();
     //update the coordinate of the trip 
      coordOrig = lastdata.startcoord;
      coordDest = lastdata.endcoord;
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
  var newdata = new Array(6);
  newdata.total = 0;
  var myroute = result.routes[0];
  for (i = 0; i < myroute.legs.length; i++) {
    newdata.total += myroute.legs[i].distance.value;
    if (i == 0) {
      newdata.start = myroute.legs[i].start_address;
      newdata.startcoord = myroute.legs[i].start_location;      
    }
    if (i == (myroute.legs.length - 1)) {
      newdata.end = myroute.legs[i].end_address;
      newdata.endcoord = myroute.legs[i].end_location;      
    }
  }
  
  newdata.overview = myroute.overview_path; // array of latlan
  
  newdata.total = newdata.total / 1000;
  return(newdata);
}



var caropts = 2;

function getColorOpts(caropts) {
  if (caropts == 2) {
   document.getElementById('car').src = '/themes/default/images/caroff.png';
   document.getElementById('lift').src = '/themes/default/images/thumbon.png';
  }
  if (caropts == 1) {
    document.getElementById('car').src = '/themes/default/images/caron.png';
    document.getElementById('lift').src = '/themes/default/images/thumboff.png';
  }
}


function gotCar() {
 caropts = 1;
 getColorOpts(caropts);
 $('#carslide').slider({"value":caropts});
}

function notCar() {
 caropts = 2;
 getColorOpts(caropts);
 $('#carslide').slider({"value":caropts}); 
}

function createDate() {
 $('#datediv').dialog('close')
}

function initDate() {
  // Not the place here for someone of thos.. just beacause is the first functino...
  // so just for setting the default values

  document.getElementById('nav-apps').innerHTML = dictionary.navApps; 
  document.getElementById('nav-travels').innerHTML = dictionary.navTravels; 
  document.getElementById('nav-settings').innerHTML = dictionary.navSettings; 

  document.getElementById('texthelp').innerHTML = dictionary.msg1;           

  document.getElementById('car').onclick = gotCar;
  document.getElementById('lift').onclick = notCar;
  getColorOpts(caropts);
  $('#carslide').slider({
   value: caropts,
   min:1,
   max:2,
   step:1,
   change: function( event, ui ) {
     caropts = $('#carslide').slider('value');
     getColorOpts(caropts);
   }  
  });

  document.getElementById('redobutton').title = dictionary.redate;
  document.getElementById('redobutton').src = '/themes/default/images/back.png';
  document.getElementById('redobutton').onclick = initDate;
 /* document.getElementById('settime').src = '/themes/default/images/ok.png';
  document.getElementById('settime').title = dictionary.setTime;
  document.getElementById('settime').onclick = initialize; */
  //$('#datediv').dialog({modal: true });
  $('#endicon').hide();
  $('#start2end').hide();
  $('#textdist').hide();
  $('#uibar').hide();
  $('#address').hide();
  $( "button, input:button, a", '#directions' ).button();
  $('#okaddress').hide();
  $('#setin').hide();
  $('#resbar').hide();
  $('#map_canvas2').hide();
  $('#dirpanel').hide();
  $('#datetime').datetimepicker();
  
  //getter
  var showButtonPanel = $('#datetime').datepicker( "option", "showButtonPanel" );
  //setter
  $('#datetime').datepicker( "option", "showButtonPanel", false );

  /* 
  $('#datetime').datepicker({
   onClose: function() {$('#datediv').dialog( "close" ) }
  });
   */
  $('#datediv').dialog({
   modal: true,
   "width": 250,
   "height":350,
   resizable : false,
   buttons: {
    Ok : function() {
      $( this ).dialog( "close" );
      document.getElementById('datetxt').innerHTML = $('#datetime').datepicker( "getDate" ) ; 
      initialize();
    }
   }
  });
}


