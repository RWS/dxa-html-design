(function(jQuery){

	$(document).on('change.bs.tab.data-api', 'select[data-toggle="tab"]', function (e) {
		e.preventDefault()
		var $selected = $(this).find(":selected");
		$($selected).tab('show')
	})

})($);