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
  
	window.onload = function () { 
	
	// Fix for collapsing carousel when we haven't picture for slide
	$('.carousel').each(function(){
		var max_height = 0;

		$(this).find('img[data-aspect]').each(function(){
			if ($(this).height() > max_height)
				max_height = $(this).height();
		});
		//intermittent issues with 0 or small height, so only set the height if its bigger than 50px
		if (height > 50)
		{
			$(this).height(max_height);
		}
	});
	
	//remove fixed heights set for images while they loaded to preserve layout
	$("img[data-height-fixed]").each(function(){
		$(this).height("");
		$(this).removeAttr("data-height-fixed");
	});
}
  
})();
/**
 * Initialize routines
 */
$(document).ready(function() {
	$('.selectpicker').selectpicker();

	//set the height of images, so layout looks good even if images are slow to load
	$("img[data-aspect]").each(function(){
		if ($(this).is(':visible'))
		{
			var aspect = $(this).attr("data-aspect");
			var width = $(this).width();
			//there is a strange intermittent issue where item width is misrepresented (as a small number)
			//so as a workaround we skip images with small widths (these should load quickly in any case)
			if (!isNaN(aspect) && aspect>0 && width>120)
			{
				$(this).height(Math.round(width/aspect));
				$(this).attr("data-height-fixed","true");
			}
		}
	});

	/*$('#rating > i').hover(function(e){
		var currentStarOpen = $(e.target).hasClass('fa-star-o');

		// Save star state
		$(e.target).data('star', currentStarOpen ? 'fa-star-o' : 'fa-star');

		if (currentStarOpen) {
 				$(e.target).removeClass('fa-star-o').addClass('fa-star');
		}
	}, function(e) {
		if ($(e.target).data('star') == 'fa-star-o') {
			$(e.target).removeClass('fa-star').addClass('fa-star-o');
		}
	});*/
});
