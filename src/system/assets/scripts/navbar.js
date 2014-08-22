(function($) {

	$.fn.setup_navigation = function(settings) {
		settings = jQuery.extend({
			menuHoverClass: 'show-menu'
		}, settings);
		
		$(this).find('> li > a').hover(function(){
			$(this).closest('ul').find('.'+settings.menuHoverClass).removeClass(settings.menuHoverClass);
		});
		$(this).find('> li > a').focus(function(){
			$(this).closest('ul').find('.'+settings.menuHoverClass).removeClass(settings.menuHoverClass);
			$(this).closest('.mega-nav-link').addClass(settings.menuHoverClass);
		});
			
		// Hide menu if click occurs outside of navigation
		// Hide menu if click or focus occurs outside of navigation
		$(this).find('a').last().keydown(function(e){ 
			if(e.keyCode == 9) {
				// If the user tabs out of the navigation hide all menus
				$('.'+settings.menuHoverClass).removeClass(settings.menuHoverClass);
			}
		});
		$(document).click(function(){ $('.'+settings.menuHoverClass).removeClass(settings.menuHoverClass); });
		
		$(this).click(function(e){
			e.stopPropagation();
		});
	}

	$('.nav').setup_navigation();

	$('.selectpicker').on('change', function(e) {
		window.location.href = $(e.target[e.target.selectedIndex]).data('href');
	});

	// Handles all meganav links to fit dropdown menu in content box
	/* BETA version
	$('.mega-nav-link').hover(function(){
		var megaNavOffset = $(this).position(),
			megaNavWidth = $(this).find('.mega-nav').get(0).scrollWidth,
			contentWidth = $('.page-border').width();

		$(this).find('.mega-nav').css('left', Math.round(contentWidth - (megaNavOffset.left + megaNavWidth)));
	});
	*/

})(jQuery);