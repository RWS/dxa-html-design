/**
* XPM specific functions
*/

(function( $ ) {
    $.fn.checkIfInXpm = function() {
		if (typeof Tridion != "undefined" && typeof Tridion.Web.UI.SiteEdit != "undefined") {
			window.console.log("in XPM");
		} else {
			window.console.log("not in XPM");
		}
    }; 
}( jQuery ));

$(document).ready(function() {
	// wait 5 seconds after document ready and check if we are in XPM
	setTimeout(function() {
		$("html").checkIfInXpm();
	}, 5000);
});

