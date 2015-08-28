(function($) {

	var notificationBar = {
    open: function(barId, barCloseId, cookie) {
      $('#' + barId).slideDown();

      $('#' + barCloseId).on('click', function() {
        notificationBar.close(barId, cookie);
      });
    },
    close: function(barId, cookie) {
      $('#' + barId).slideUp();
      $.cookie(cookie, true, { path: '/' });
    },
    reset: function(cookie) {
      $.removeCookie(cookie, { path: '/' });
    },
    setup: function(barId, barCloseId, cookie, func) {
      if (func()) this.open(barId, barCloseId, cookie);
    }
  };

  $('#reset-cookiebar').click(function() {
    notificationBar.reset('seen-cookie-notice');
  });

  notificationBar.setup('cookie', 'cookie-hide', 'seen-cookie-notice', function() {
    return !$.cookie('seen-cookie-notice');
  });
  notificationBar.setup('incompability', 'incompability-hide', 'seen-incompability-notice', function() {
    return $('html').is('.lt-ie8');
  });

})(jQuery);