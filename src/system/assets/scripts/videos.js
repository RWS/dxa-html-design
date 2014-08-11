(function($) {

	$("body").fitVids();

	$('.embed-video > button').on('click', function() {
		$(this).parent().html('<iframe width="960" height="720" src="//www.youtube.com/embed/'+$(this).data('video')+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>').fitVids();
	});

})(jQuery);