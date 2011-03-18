/* 

   Just give some style and set the localized words in the settings.

*/

function initSettings() {

/*
 Settings the text on the various fields
*/

 $('#settings1').text(dictionary.settingsBasic);
 $('#settings2').text(dictionary.settingsBaseSearch);
 $('#settings3').text(dictionary.settingsTresholdsSearch);
 $('#settings4').text(dictionary.subscriptionDetails);
   
 $('#label_contactpref').text(dictionary.contactPref);
 $('#label_suppl_contact').text(dictionary.suppContact);
 $('#label_usual_search').text(dictionary.usualSearch);
 $('#label_aval_sits').text(dictionary.avalSits);
 $('#label_range_time').text(dictionary.rangeTime);
 $('#label_range_time_sense').text(dictionary.senseTime);
 $('#label_result_treshold').text(dictionary.resTreshold);
 
 $('#pay').text(dictionary.oneMonth);
 
 $('#savesettings').text(dictionary.saveSettings);

/*
going trough the select's options...
*/ 
  
 $("option").each(function(index) {
 // wanted to do this in a smart way... but then laziness..
  if ($(this).val() == 'notify') {
    $(this).text(dictionary.settingsNotify)
  }
  if ($(this).val() == 'mail') {
    $(this).text(dictionary.settingsMail)
  }
  if ($(this).val() == 'phone') {
    $(this).text(dictionary.settingsPhone)
  }
  if ($(this).val() == 'passenger') {
    $(this).text(dictionary.settingsPassenger)
  }
  if ($(this).val() == 'lift') {
    $(this).text(dictionary.settingsLift)
  }
  if ($(this).val() == 'less') {
    $(this).text(dictionary.less )
  }
  if ($(this).val() == 'more') {
    $(this).text(dictionary.more)
  }
  if ($(this).val() == 'both') {
    $(this).text(dictionary.both)
  }                
 });
 
 
/*
Checking and Binding some menu to event in order to make sense
*/ 

 if ($('#id_contactpref').val() == 'notify') {
  $('#id_suppl_contact').attr('disabled', true);
 };
 $('#id_contactpref').change(function(){
  if ($(this).val() == 'notify') {
   $('#id_suppl_contact').attr('disabled', true);
  } else {
   $('#id_suppl_contact').attr('disabled', false);
  }
 }); 
  
/*
chacking if is the case to enable the number of sit field and slider will be
done later once the slider is created
*/

 $('#id_usual_search').change(function(){
  if ($(this).val() == 'passenger') {
   $('#id_aval_sits').attr('disabled', false);
   var disabled = $('#slider_aval_sits').slider( "option", "disabled" );
   $('#slider_aval_sits').slider( "option", "disabled", false) 
  } else {
   $('#id_aval_sits').attr('disabled', true);
   var disabled = $('#slider_aval_sits').slider( "option", "disabled" );
   $('#slider_aval_sits').slider( "option", "disabled", true )
  }
 });


/* 
 if ($('#id_range_time').val() == 0) {
  $('#id_range_time_sense').attr('disabled', true);
 };
*/ 
 
/*
 Jquery-UI for the page theme and user friendly stuff
*/ 

 $( "#settings" ).accordion({
  fillSpace:true,
  autoHeight: true,
  navigation: true
 });
 
 $('#slider_result_treshold').slider({
  value: $('#id_result_treshold').val(),
  min: 30,
  max: 100,
  step: 10,
  slide: function( event, ui ) {
   $('#id_result_treshold').val( ui.value );
  }
 });  
 $('#id_result_treshold').val($('#slider_result_treshold').slider('value') );
 
 $('#slider_aval_sits').slider({
  value: $('#id_aval_sits').val(),
  min: 1,
  max: 12,
  step: 1,
  slide: function( event, ui ) {
   $('#id_aval_sits').val( ui.value );
  }
 });  
 $('#id_aval_sits').val($('#slider_aval_sits').slider('value') );
 
/* Now we can check to enabel or not the number of sit slider */
 
 if ($('#id_usual_search').val() == 'lift') {
  $('#id_aval_sits').attr('disabled', true);
  var disabled = $('#slider_aval_sits').slider( "option", "disabled" );
  $('#slider_aval_sits').slider( "option", "disabled", true )
 };
 
 $('#slider_range_time').slider({
 value: $('#id_range_time').val(),
  min: 30,
  max: 240,
  step: 30,
  slide: function( event, ui ) {
   $('#id_range_time').val( ui.value );
/*   if (ui.value == 0) {
    $('#id_range_time_sense').attr('disabled', true);
   } else {
    $('#id_range_time_sense').attr('disabled', false);
   }*/
  }
 });  
$('#id_range_time').val($('#slider_range_time').slider('value') );
 
  $('#pay').button({
  icons: {
   primary: 'ui-icon-cart',
   secondary: 'ui-icon-circle-plus'
  }
 });
 
 $('#savesettings').button({
  icons: {
   primary: 'ui-icon-disk'
  }
 });
}



