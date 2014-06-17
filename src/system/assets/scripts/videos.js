(function(jQuery){

	$("body").fitVids();

	$('.embed-video > button').on('click', function() {
		$(this).parent().html('<iframe width="960" height="720" src="//www.youtube.com/embed/'+$(this).data('video')+'" frameborder="0" allowfullscreen></iframe>');
	});

})($);