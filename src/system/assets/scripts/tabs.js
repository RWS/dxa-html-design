(function($) {

  // Change active tab after page is loaded if we have hash-link to tab in URL
  var hash = document.location.hash,
      prefix = "tab_";

  if (hash) {
    var newHash = hash.replace(prefix,'');
    $('select.tab-group').is(':visible') ?
      $('.tab-group option[value=' + newHash + ']').prop('selected', true).tab('show').closest('.tab-container').attr('data-active-tab', newHash) :
      $('.tab-group a[href=' + newHash + ']').tab('show').closest('.tab-container').attr('data-active-tab', newHash);  
  } 

  // Tabs
  $('.tab-container').on('tab.change', function(e, tab) {
    var activeTab = $(this).data('active-tab'),
        nextTab = tab.target.hash ? tab.target.hash
                                  : tab.target[tab.target.selectedIndex].value;

    if (activeTab != nextTab) {
      // Store active tab in tab container
      $(this).data('active-tab', nextTab);

      // Changing tab by click on link
      if (tab.target.hash) {
        $(tab.target).tab('show'); 
        $(tab.relatedTarget).tab('hide');
        $(this).find('select.tab-group option[value="' + nextTab + '"]').prop('selected', true);
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
    document.location.hash = e.target[e.target.selectedIndex].value.replace('#', '#' + prefix);
  });

  // Changing tab by click on link
  $('.tab-group a').on('click', function(e) {
    $(this).closest('.tab-container').trigger('tab.change', e);
    document.location.hash = e.target.hash.replace('#', '#' + prefix);
    return false;
  });

})(jQuery);