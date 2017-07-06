(function($){

	$('#show-loader').click(function(){
		$('#loading-example').addClass('is-loading');
		setTimeout(function(){
			$('#loading-example').removeClass('is-loading');
		}, 5000);
		return false;
	});

})(jQuery);