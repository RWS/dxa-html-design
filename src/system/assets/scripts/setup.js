/**
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 */
(function() {

  SDL_ENV = {
    isSmallScreen: document.body.clientWidth < 768 // IE8 doesn't support media queries so we can't use Modernizr.mq here
  };

  if (!window.console) {
    window.console = {};
  }
  // union of Chrome, FF, IE, and Safari console methods
  var m = [
    "log", "info", "warn", "error", "debug", "trace", "dir", "group",
    "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
    "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
  ];
  // define undefined methods as noops to prevent errors
  for (var i = 0; i < m.length; i++) {
    if (!window.console[m[i]]) {
      window.console[m[i]] = function() {};
    }    
  } 
})();
/**
 * Initialize routines
 */
$(document).ready(function() {
	$('.selectpicker').selectpicker();
	$('.loader .loader-img').one('load', function() {
	  $(this).closest('.loader').find('.loader-overlay').remove();
	  $(this).closest('.loader').removeClass('loader');
	}).each(function() {
	  if (this.complete) $(this).load();
	});

	// Javascript to enable link to tab
	var hash = document.location.hash;
	var prefix = "tab_";
	if (hash) {
		if ($('.dropdown').is(':visible')) {
		  $('.dropdown select option[data-target='+hash.replace(prefix,"")+']').prop('selected', true).tab('show');
		}
		else {
		  $('.nav-tabs a[href='+hash.replace(prefix,"")+']').tab('show');  
		}
	} 

	// Change hash for page-reload
	$('.nav-tabs a').on('shown.bs.tab', function (e) {
		window.location.hash = e.target.hash.replace("#", "#" + prefix);
	});       

	$('.dropdown select').on('change', function (e) {
		window.location.hash = e.target[e.target.selectedIndex].dataset.target.replace("#", "#" + prefix);
	});
});
