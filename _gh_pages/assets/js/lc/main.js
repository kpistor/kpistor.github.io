try {
    var servicesUrl = templateDirectory + '/services.php';
} catch (exc) {
    console.log(exc);
}

$(document).ready(function () {
    $('.hit-enter').keyup(function (e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
            var target = $(this).attr('data-target');
            $(target).click();
            return false;
        }
        return true;
    });

    $.validity.setup({ outputMode:"summary" });
    
    $('.newsletter .submit').click(function() {
        if(!validateSignup())
            return false;
        
        var values = scrapeForm('#newsletterSignup', 'name');
        $.post(servicesUrl, { "action": "listSubscribe", "data" : JSON.stringify(values)}, newsletterCallback);

        return false;
    });
    
    //$('.carousel').carousel('pause');
    $('.carousel').carousel({interval: 0});
    
    //touch support for bootstrap carousel
    $('.carousel').swiperight(function() {  
        $(this).carousel('prev');  
    });  
    $('.carousel').swipeleft(function() {  
        $(this).carousel('next');  
    });      

    $('.Contact').click(function(){
        scrollTo($(this).attr('href'));
        return false;
    });

    $('.Work').click(function(){
        var $this = $(this);
        var marker = $this.attr('href');
        if(!$('body').hasClass('home')) {
            window.location = '/?scrollto=' + marker.replace(/\#*/g, "");
            return false;
        }
        
        scrollTo(marker);
        return false;
    });
    
    //Close nav bar after click
    $('.nav-collapse a').click(function (e) {
        if ($('.nav-collapse').hasClass('in')) {
            $('.btn-navbar').click();
        }
    });
    
    logosAction();
    
    collapseRotate();
    
    //lazy load images
    //$('img.lazy').lazyload();
    
    loadingImages();
    
    leaderBio();
    
    //Hero image parallax
    try
    {
        if(validDesktop() && validVersion()) //Activate only if Desktop
        {
            console.log('parallax-activate'); //DEBUG
            var heroImage = $('header .hero-image');
            if(heroImage.length > 0) {
                $(window).scroll(function() {
                    var $this = $(this);
                    var top = $this.scrollTop();
                    heroImage.css('transform', 'translateY(' + (top/2) + 'px)');
                });
            }
            
        }
    } catch (exc) {
        console.log(exc);
    }
	// SVG -> PNG fallback - svg & png must have same name
	svgeezy.init(false, 'png');
});

function validDesktop() {
    var mobileString = ['IPAD', 'IPHONE', 'ANDROID'];
    //console.log('userAgent:' + userAgent.toUpperCase()); //DEBUG
    if($.inArray(userAgent.toUpperCase(), mobileString) === -1)
        return true;
    
    return false;
}

function validVersion() {
    //console.log('userAgent:' + userAgent.toUpperCase()); //DEBUG
    //console.log('version: ' + parseInt(getBrowserVersion())); //DEBUG
    var version = getBrowserVersion();
    if(userAgent.toUpperCase() === 'IE' && parseInt(version) > 8.0)
        return true;
    if(userAgent.toUpperCase() === 'FIREFOX' && parseInt(version) > 16)
        return true;
    if(userAgent.toUpperCase() === 'CHROME' && parseInt(version) > 21)
        return true;
    if(userAgent.toUpperCase() === 'SAFARI' && parseInt(version) >= 5)
        return true;
    
    return false;
}

$(window).load(function() {
    //equal heights for 2 columns
    equalHeightsModule();
    $(window).resize(function() {
        equalHeightsModule();
    });
    
    try
    {
        //console.log('userAgent:' + userAgent.toUpperCase()); //DEBUG
        if(validDesktop()) //Activate only if Desktop
        {
            //$('.project.navbar').waypoint('sticky', {offset: -2}); //projects / clients top nav

            //Hero image + navbar
            var $navbar = $('.home .navbar-inner');
            $navbar.waypoint('sticky');

            $navbar.parent().waypoint('sticky', {stuckClass: 'navbar-fixed-bottom', offset: 'bottom-in-view', direction: 'up', target: '.navbar-inner'});

            if($navbar.is(':below-the-fold'))
                $navbar.toggleClass('navbar-fixed-bottom', true);

        }
    } catch (exc) {
        console.log(exc);
    }
    
    setClientListImages('#tab-content1 div.img-wrapper');
    resizeClientListImages();
    $(window).resize(function () {
        resizeClientListImages(); 
    });
    
    scrollToAnchor();
    
    if(document.location.hash)
    {
        //console.log(document.location.hash); //DEBUG
        window.location = document.location.hash;
    }
});

function scrollToAnchor() {
    //Smooth scroll to AnchorTag from query string
    var url = $.url();
    var marker = url.param('scrollto');
    if (marker)
    {
        scrollTo('#' + marker);
        return false;
    }
}    

function equalHeightsModule() {
    var env = findBootstrapEnvironment();
    if(env == 'phone') {
        $('.equal-height').css('height', '');
    } else {
        $('.equal-height').css('height', '');
        $('.herotext-2columns .equal-height').equalHeights();
        $('.herotext-image-2columns .equal-height').equalHeights();
    }
}

function resizeClientListImages() {
    var $hiddenList = $('.client-list:hidden');
    $hiddenList.show();
    $('.client-list .img-url').each(function(){
        var $this = $(this);
        var wrapper = $this.find('div.img-wrapper');
        var orig = wrapper.find('.orig');
        if(wrapper.width() > $this.width()) {
            wrapper.css('width', $this.width());
            wrapper.css('height', orig.height());
        } else {
            wrapper.css('width', $this.width());
            wrapper.css('width', orig.width());
            wrapper.css('height', orig.height());
        }
    });
    $hiddenList.hide();
}

function setClientListImages(selector) {
    //Set img-wrapper width/height as img
    var $hiddenList = $('.client-list:hidden');
    $hiddenList.show();
    var $imgWrapper;
    if(selector)
        $imgWrapper = $(selector);
    else 
        $imgWrapper = $('.client-list div.img-wrapper');
    $imgWrapper.each(function(){
        var $this = $(this);
        var orig = $this.find('.orig');
        $this.css('height', orig.height());
        $this.css('width', orig.width());
    });
    $hiddenList.hide();
}

function scrollTo(marker) {
    var jMarker;
    if (marker instanceof jQuery)
        jMarker = marker;
    else
        jMarker = $(marker);
    
    var pos = jMarker.offset().top - $('.navbar-wrapper').height();
    //console.log('navbar height:' + $('.navbar-wrapper').height()); //DEBUG
    $('html, body').animate({
        scrollTop: pos
    }, 500);
}

function collapseRotate() {
    $('.accordion-toggle').click(function (e) {
        var $this = $(this);
        var plusSign = $this.find('.plus-sign');
        if($this.hasClass('shown')) {
            plusSign.animate({ rotate: '-=45' }); 
            $this.removeClass('shown')
        } else {
            //close other first
            $($this.attr('data-parent')).find('.shown').each(function() {
                var $this = $(this);
                if($this.hasClass('shown')) {
                    $this.find('.plus-sign').animate({ rotate: '-=45' }); 
                    $this.removeClass('shown')
                }
            });
            plusSign.animate({ rotate: '+=45' }); 
            $this.addClass('shown');
        }
    })
}

function newsletterCallback(result)
{
    result = $.parseJSON(result);
    if(result['Status'] === 'error') 
        $('.newsletter-confirm').html('<span class="error">' + result['Message']+ '</span>').show();
    else {
        $('#newsletterSignup').hide();
        //clearFields('#newsletterSignup');
        $('.newsletter-confirm').html(result['Message']).show();
    }
}

function validateSignup() {
    $.validity.start();
    var signup = $('.newsletter .signup');
    signup.require();
    signup.match('email');
    var result = $.validity.end();
    return result.valid;
}

function logosAction() {
    try
    {
        //console.log('userAgent:' + userAgent.toUpperCase()); //DEBUG
        //Client Logo CaseStudies
        if(validDesktop()) //Activate only if Desktop
        {

            $('.client-list .img-wrapper').each(function(){
                var $this = $(this);
                var orig = $this.find('.orig');
                var hilite = $this.find('.hilite');
                var speed = 250;
                if($this.parent().attr('href')) {
                    $this.hover(function() {
                        orig.hide();
                        hilite.show();
                    }, function() {
                        orig.show();
                        hilite.hide();
                    }); 
                }
            });
        }
    } catch (exc) {
        console.log(exc);
    }
    
    $('.no-click').click(function(){
        return false;
    });
}

function loadingImages() {
    $('img.loading').each(function() {
        var $this = $(this);
        var parent = $this.parent();
        $this.load(function() {
            parent.find('div.loading').hide().removeClass('loading');
            $this.fadeIn(1000);
            //console.log('image loaded'); //DEBUG
        });
    });
    $('img.loading').each(function() {
        var $this = $(this);
        //var parent = $this.parent();
        //parent.prepend('<div class="loading" ></div>');
        $this.attr('src', $this.attr('data-src'));
    });
}

function leaderBio() {
    $('.bio-link').click(function(){
        var target = $(this).attr('data-target');
        //console.log(target); //DEBUG
        $('.bio.active[data-id!="' + target + '"]').removeClass('active').hide(); //hide active first
        
        $('.people div[data-id="' + target + '"]').each(function() {
            var $this = $(this);
            $this.toggleClass('active');
            if($this.hasClass('active'))
                $this.fadeIn(300);
            else 
                $this.fadeOut(300);
        });
        return false;
    });
}