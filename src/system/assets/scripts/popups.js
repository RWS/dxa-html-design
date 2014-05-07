(function(jQuery){

	var ignoreMobileSelector = SDL_ENV.isSmallScreen ? ":not(.popup-mobile-ignore)" : "";

	$(".popup-image" + ignoreMobileSelector).magnificPopup({
		type: "image"
	});

	$(".popup-iframe" + ignoreMobileSelector).magnificPopup({
		type: "iframe"
	});

	$(".popup-image-gallery" + ignoreMobileSelector).each(function(){
		$(this).magnificPopup({
			delegate: 'a',
			type: "image",
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0,1]
			}
		});
	});

	$('.popup-inline' + ignoreMobileSelector).magnificPopup({
		type:'inline'
	});

	$('.popup-ajax' + ignoreMobileSelector).magnificPopup({
		type:'ajax'
	});

})($);