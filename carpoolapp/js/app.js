
/*
 Metafunction to run all the required parts
*/

function initApp() {
 dateTimeSection();
 carSection();
 Arrows();
 mainApp();
}

/*
 The default variables are set in the head of the page 
 in order to retrieve the python tag (imported from the Datastore)

  var usual_search = "{{settings.usual_search}}";

*/

/*
 Define the theme and function for the date part
*/
function dateTimeSection() {
 $('#day').css(
  {
   'background' : "url(\'"+themedir+"calendar.png\') no-repeat",   
  });
 $('#datetxt').css(
  {
   'background' : "url(\'"+themedir+"wrong.png\') no-repeat",
  });
 
 $('#dateres').hover(
  function() {
   $(this).addClass('ui-corner-all ui-state-hover');
  },
  function() {
   $(this).removeClass('ui-corner-all ui-state-hover');
  }
 );

 $('#dateres').click( function() {
  $('#datetime').datetimepicker({
    stepMinute: 15, 
   });
  //getter
  var showButtonPanel = $('#datetime').datepicker( "option", "showButtonPanel" );
  //setter
  $('#datetime').datepicker( "option", "showButtonPanel", false );
  setTime();
 });
}

function setTime() {
  $('#datedialog').dialog({
   modal: true,
   "width": 250,
   "height":400,
   resizable : false,
   buttons: {
    Ok : function() {
      $( this ).dialog( "close" );
      $('#datetxt').css(
        {
         'background' : "",   
      });
      var datestr = $('#datetime').datetimepicker( "getDate" );
      $('#day').html('<b>'+datestr.getDate()+'</b>');
      $('#datetxt').html("<b>"+dictMonths[datestr.getMonth()]+"</b> "+ datestr.getFullYear()+"</br>" + datestr.getHours()+":"+datestr.getMinutes());
    }
   }
  });
}  
/*
 Done with Date
 Beginning lift/passenger section
*/  

function carSection() {
 $('#sits').attr('title',dictionary.avalSit);
 $('#aval_sits').attr('title',dictionary.avalSit);
 $('#car').attr('title',dictionary.look4passenger);
 $('#lift').attr('title',dictionary.look4lift);
 $('#sits').attr({ 'src' : themedir+"couch.png" });
 var carslide_set;
 if (usual_search == 'lift') {
  carslide_set = 2;
 }
 if (usual_search == 'passenger') {
  carslide_set = 1;
 }
 $('#car').click(gotCar);
 $('#lift').click(notCar);
 setCar(carslide_set);
 $('#carslide').slider({
  value: carslide_set,
  min: 1,
  max: 2,
  step:1,
  change: function( event, ui ) {
   carslide_set = $('#carslide').slider('value');
   setCar(carslide_set);
  }  
 });
}

function setCar(int) {
 if (int == 2) {
  $('#car').attr({ 'src' : themedir+'caroff.png' });
  $('#lift').attr({ 'src' : themedir+'thumbon.png' });
  usual_search = 'lift';
  $('#aval_sits').attr('disabled', true)
 }
 if (int == 1) {
  $('#car').attr({ 'src' : themedir+'caron.png' });
  $('#lift').attr({ 'src' : themedir+'thumboff.png' });
  usual_search = 'passenger';
  $('#aval_sits').attr({ 'disabled': false })
 }
}

function gotCar() {
 setCar(1);
 $('#carslide').slider({"value":1});
}

function notCar() {
 setCar(2);
 $('#carslide').slider({"value":2});
}

/*
 Done with lift/passenger choiche
 Start arrow browser:
*/

function Arrows () {
 $('#left').attr({ 'src' : themedir+'arrowoff_left.png' });
 $('#left').attr({ 'disabled' : true });
}

/*
 Done with arrows
 Start Maps part
*/

function mainApp() {
 $('#okaddress').text(dictionary.ok);
 $('#setit').text(dictionary.setLoc);
 
 $('#okaddress').button({
  icons: {
   primary: 'ui-icon-pin-s'
  }
 });
 $('#setit').button({
  icons: {
   primary: 'ui-icon-circle-check'
  }
 });
 initMap();
 $('#okaddress').click( function() {
 codeAddress();
 });
 
 
}
