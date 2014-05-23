(function(jQuery){

	window.setupCookieBar = function(setAsSeen){
		if($.cookie('seen-cookie-notice') === undefined){
			$('#cookiebar').show();

			if(setAsSeen){
				$.cookie('seen-cookie-notice', true , { path: '/' });
			}

			$('#cookiebar-hide').click(function(){
				$.removeCookie('seen-cookie-notice', { path: '/' });
				$('#cookiebar').slideUp();
				return false;
			});
		}
	}

	setupCookieBar(true);

})($);