(function(jQuery){

	$('#reset-cookiebar').click(function(){
		$.removeCookie('seen-cookie-notice', { path: '/' });
		setupCookieBar(false);
		return false;
	});

})($);