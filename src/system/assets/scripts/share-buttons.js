(function(jQuery){

    var pageTitle = document.title; //HTML page title
    var pageUrl = location.href; //Location of the page
        
    //user clicks on a share button
    $('.share-buttons a').click(function(event) {

        var shareName = $(this).parent().attr('class'); //get the first class name of clicked element
        
        switch (shareName) //switch to different links based on different social name
        {
            case 'share-facebook':
                var openLink = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) + '&amp;title=' + encodeURIComponent(pageTitle);
                break;
            case 'share-twitter':
                var openLink = 'http://twitter.com/home?status=' + encodeURIComponent(pageTitle + ' ' + pageUrl);
                break;
            case 'share-digg':
                var openLink = 'http://www.digg.com/submit?phase=2&amp;url=' + encodeURIComponent(pageUrl) + '&amp;title=' + encodeURIComponent(pageTitle);
                break;
            case 'share-stumbleupon':
                var openLink = 'http://www.stumbleupon.com/submit?url=' + encodeURIComponent(pageUrl) + '&amp;title=' + encodeURIComponent(pageTitle);
                break;
            case 'share-delicious':
                var openLink = 'http://del.icio.us/post?url=' + encodeURIComponent(pageUrl) + '&amp;title=' + encodeURIComponent(pageTitle);
                break;
            case 'share-google-plus':
                var openLink = 'https://plus.google.com/share?url=' + encodeURIComponent(pageUrl) + '&amp;title=' + encodeURIComponent(pageTitle);
                break;
            case 'share-email':
                var openLink = 'mailto:?subject=' + pageTitle + '&body=Found this useful link for you : ' + pageUrl;
                break;
        }

        //Parameters for the Popup window
        winWidth    = 650;  
        winHeight   = 450;
        winLeft     = ($(window).width()  - winWidth)  / 2,
        winTop      = ($(window).height() - winHeight) / 2, 
        winOptions   = 'width='  + winWidth  + ',height=' + winHeight + ',top='    + winTop    + ',left='   + winLeft;
        
        // Open Popup window and redirect user to share website.
        // IE8 doesn't like spaces (even %20) in the window name
        window.open(openLink, 'Share', winOptions);
        return false;

    });

})($);