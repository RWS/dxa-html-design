(function($) {

	$('.static-map').each(function(){
		var map = {
			center: $(this).data('center'),
			markers: $(this).data('markers'),
			zoom: $(this).data('zoom')
		};

		$('<img/>').attr({
			src: '//maps.google.com/' + map.center + '&zoom=' + map.zoom + '&markers=' + map.markers,
		}).appendTo($(this));

	});

})(jQuery);