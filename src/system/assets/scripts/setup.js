(function(jQuery){

	var SDL_ENV = {};
	// IE8 doesn't support media queries so we can't use Modernizr.mq here
	SDL_ENV.isSmallScreen = document.body.clientWidth < 768;

	window.SDL_ENV = SDL_ENV;

})($);