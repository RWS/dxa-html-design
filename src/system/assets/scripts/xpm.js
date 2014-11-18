/**
* XPM specific functions
*/
(function($) {
	// initialize global variable
	SDL_ENV.isInXpm = false;
	
	// check and set global variable
	$.fn.checkIfInXpm = function() {	
		// check via availability of Tridion objects
		if (typeof Tridion != "undefined" && typeof Tridion.Web.UI.SiteEdit != "undefined") {
			console.log("in XPM");
			SDL_ENV.isInXpm = true;
			
			// display xpm buttons
			$(".xpm-button").show();
			
			// pause automatic scrolling of carousels
			$(".carousel").carousel("pause");
		} else {
			console.log("not in XPM");
			SDL_ENV.isInXpm = false;
			
			// hide xpm buttons
			$(".xpm-button").hide();
		}
	}; 
}(jQuery));

$(document).ready(function() {
	// wait 5 seconds after document ready (to complete XPM load) and check if we are in XPM (setting global variable)
	setTimeout(function() {
		$().checkIfInXpm();
	}, 5000);
});
