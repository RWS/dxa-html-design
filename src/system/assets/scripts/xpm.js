/**
* XPM specific functions
*/
$(document).ready(function() {
	if (typeof Tridion != "undefined" && typeof Tridion.Web.UI.SiteEdit != "undefined") {
		window.console.log("in XPM");
		
	} else {
		window.console.log("not in XPM");
	}
});