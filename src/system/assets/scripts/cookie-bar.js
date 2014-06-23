(function($) {

	cookieBar = {
    open: function() {
      $('#cookiebar').slideDown();

      $('#cookiebar-hide').click(function() {
        cookieBar.close();
      });
    },
    close: function() {
      $('#cookiebar').slideUp();
      $.cookie('seen-cookie-notice', true, { path: '/' });
    },
    reset: function() {
      $.removeCookie('seen-cookie-notice');
    },
    setup: function() {
      if (!$.cookie('seen-cookie-notice')) this.open();
    }
  };

  cookieBar.setup();

})(jQuery);