(function($) {

	$('a[data-toggle="tab"]').on('click', function (e) {
	  $(e.target).tab('show'); // activated tab
	  $(e.relatedTarget).tab('hide'); // previous tab
	  return false;
	});

})(jQuery);