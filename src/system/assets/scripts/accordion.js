(function($) {

	if(SDL_ENV.isSmallScreen)
		$('.responsive-accordion a[data-toggle="collapse"]').removeAttr('data-parent');

})(jQuery);