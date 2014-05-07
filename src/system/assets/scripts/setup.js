(function(jQuery){

	var SDL_ENV = {};

	SDL_ENV.isSmallScreen = Modernizr.mq('only screen and (max-width: 768px)');

	window.SDL_ENV = SDL_ENV;

})($);