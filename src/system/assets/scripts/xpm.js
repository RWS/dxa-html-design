/**
* XPM specific functions
*/
(function($) {
	// check whether in xpm
	$.fn.isInXpm = function() {	
		var isInXpm = false;
		// check via availability of Tridion objects
		if (typeof Tridion != "undefined") {
			if (Tridion.Type.resolveNamespace("Tridion.Web.UI.SiteEdit.Page") || Tridion.Type.resolveNamespace("Tridion.Web.UI.Editors.XPMCore.Controls.Page")) {
				isInXpm = true;
			}
		}
		console.log("in XPM: " + isInXpm);
		return isInXpm;
	};
}(jQuery));

$(document).ready(function() {
	// wait 5 seconds after document ready (to complete XPM load) and check if we are in XPM (setting global variable)
	setTimeout(function() {
		if ($().isInXpm()) {
			// display xpm buttons
			$(".xpm-button").show();
			
			// pause automatic scrolling of carousels
			$(".carousel").carousel("pause");
		}
	}, 5000);
});