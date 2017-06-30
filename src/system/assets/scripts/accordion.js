(function($) {

	if(SDL_ENV.isSmallScreen)
		$('.responsive-accordion div[data-toggle="collapse"]').removeAttr('data-parent');

})(jQuery);