(function($) {

  // Tabs

  $('.tab-container').on('tab.change', function(e, tab) {
    var activeTab = $(this).data('active-tab'),
        nextTab = tab.target.hash ? tab.target.hash
                                  : tab.target.selectedOptions[0].dataset.target;

    if (activeTab != nextTab) {
      // Store active tab in tab container
      $(this).attr('data-active-tab', nextTab);

      // Changing tab by click on link
      if (tab.target.hash) {
        $(tab.target).tab('show'); 
        $(tab.relatedTarget).tab('hide');
        $(this).find('select.tab-group option[data-target="' + nextTab + '"]').prop('selected', true);
      }
      // Changing tab by select control
      else {
        $(this).find('.tab-group a[href="' + nextTab + '"]').tab('show');
      }
    }

    return false;
  });

  // Changing tab by select control
  $('.tab-group').on('change', function(e) {
    $(this).closest('.tab-container').trigger('tab.change', e);
  });

  // Changing tab by click on link
  $('.tab-group a[data-toggle="tab"]').on('click', function(e) {
    $(this).closest('.tab-container').trigger('tab.change', e);
  });

})(jQuery);