/* 

All the default variable are setted at the beginning

*/


var lang = 'en_US';
var theme = 'default';
var themedir = '/themes/' + theme + '/images/';

/* Load right away the language file */
var langs_dict = '/langs/' + lang + '/words.js';
$.getScript(langs_dict);


/* 
Put the text on thenav and other Base page elements 
*/

function loadBaseText() {
 $('#nav-apps').text(dictionary.navApps);
 $('#nav-travels').text(dictionary.navTravels);
 $('#nav-settings').text(dictionary.navSettings);
}

