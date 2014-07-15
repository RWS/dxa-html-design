(function($) {

	$('a[data-toggle="tab"]').on('click', function (e) {
	  $(e.target).tab('show'); // activated tab
	  $(e.relatedTarget).tab('hide'); // previous tab
	  return false;
	});

	$('.tab-select').on('change', function (e) {
	  $(e.target.selectedOptions[0]).tab('show'); // activated tab
	  return false;
	});

})(jQuery);