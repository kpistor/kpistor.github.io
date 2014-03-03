
$(document).ready(function() {
    $('.client-list-nav .tab').click(function(){
        var $this = $(this);
        $('.client-list-nav .active').removeClass('active');
        $this.addClass('active');
        $('.client-list:visible').hide();
        $($this.attr('data-target')).fadeIn(300);
        
        if($this.hasClass('tab2'))
            $('#tab-content2 img.lazy').each(function(){
                var $this = $(this);
                $this.trigger('show');
                $this.load(function(){
                    var parent = $this.parent();
                    parent.width('100%').height('100%'); //this set image width to original first
                    
                    //console.log($this.width()); //DEBUG
                    parent.css('height', $this.height());
                    parent.css('width', $this.width());
                });
            });
    });
   
    $('#tab-content2 img.lazy').lazyload({
        event: 'show'
    });
    //$('.projects img.lazy').lazyload();
    
    try
    {
        //console.log('userAgent:' + userAgent.toUpperCase()); //DEBUG
        //Client Logo CaseStudies
        if(userAgent.toUpperCase() != 'IPAD' 
                && userAgent.toUpperCase() != 'IPHONE' 
                && userAgent.toUpperCase() != 'ANDROID') //Activate only if Desktop
        {

            $('.projects .popup').each(function(){
                var $this = $(this);
                var more = $this.find('.more');
                var speed = 250;
                if($this.parent().attr('href')) {
                    $this.hover(function() {
                        more.toggleClass('light-grey-bg', false);
                        more.toggleClass('dark-grey-bg', true);
                    }, function() {
                        more.toggleClass('light-grey-bg', true);
                        more.toggleClass('dark-grey-bg', false);
                    }); 
                }
            });
            
            $('.projects .content[data-url]').click(function(){
                window.location = $(this).attr('data-url');
            });
            
        }
    } catch (exc) {
        console.log(exc);
    }
});

function toggleProjectPopup($popup) {
    var pageWidth = $popup.parent().width();
    var maxWidth = 370;
    if(pageWidth  <= (maxWidth + 40)) {
        maxWidth = pageWidth - 70;
    }
    //console.log(pageWidth + '; ' + maxWidth); //DEBUG
    if($popup.width() > 0){
        var content = $popup.find('.content');
        content.css('margin-left', '-9000px'); //adjust height
        $popup.animate({width: 0, height: 0}, 150);
        $popup.parent().find('.open').animate({ rotate: '-=45' });
        return false;
    }else{
        var content = $popup.find('.content');
        var contentHt = content.height();
        var contentMarginTop = content.css('margin-top');
        content.css('margin-left', contentMarginTop ); 
        $popup.animate({width: maxWidth, height: (contentHt + (2 * parseInt(contentMarginTop)))}, 150);
        $popup.parent().find('.open').animate({ rotate: '+=45' }); 
        return true;
    }
}

