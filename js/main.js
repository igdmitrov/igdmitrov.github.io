$(document).ready(function() {
    //add browser name and version to body element
    navigator.sayswho = (function(){
        var ua= navigator.userAgent, tem,
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '').toLowerCase();
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera').toLowerCase();
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ').toLowerCase();
    })();
    $('body').addClass(navigator.sayswho);
    
    var onTransitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd';
    var onAnimationEnd = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';
    var slideTransitionFlag = false;
    var currentSlide = 0;
    var sectionArray = [];
    var windoWidth = $(window).outerWidth();
    
    $(window).on("resize", function(event){
        windoWidth = $(window).outerWidth();
    });
    
    $('.section').each(function(){
        sectionArray.push($(this));
    });
    
    changeSlide(currentSlide, currentSlide);
    
    function changeSlide(currentSlideIndex, nextSlideIndex){
        if(slideTransitionFlag == false && nextSlideIndex > -1 && nextSlideIndex < sectionArray.length && windoWidth > 1024){
            slideTransitionFlag = true;
            sectionArray[currentSlideIndex].removeClass('active').removeClass('animate');
            sectionArray[nextSlideIndex].addClass('active').addClass('animate');
            $('.js-nav-link').eq(currentSlideIndex).removeClass('active');
            $('.js-nav-link').eq(nextSlideIndex).addClass('active');
            
            if(nextSlideIndex == (sectionArray.length - 1)){
                $('.particles-js').removeClass('particles-js--brown');
            }else{
                $('.particles-js').addClass('particles-js--brown');
            }
                
            setTimeout(function(){
                slideTransitionFlag = false;
                currentSlide = parseInt(nextSlideIndex);
                return currentSlide;
            }, 500);
        }
    }
    
    function nextSection(){
        console.log('next');
        var goToIndex = currentSlide + 1;
        changeSlide(currentSlide, goToIndex);
    }
    function prevSection(){
        console.log('prev');
        var goToIndex = currentSlide - 1;
        changeSlide(currentSlide, goToIndex);
    }
    
    $('.js-nav-link').on('click', function(e){
        e.preventDefault();
        if (windoWidth > 1024) {
            var goToIndex = $(this).attr('href');
            changeSlide(currentSlide, goToIndex);
        }else if (windoWidth <= 1024) {
            var sectionIndex = parseInt($(this).attr('href')) + 1;
            var navLink = '#section-' + sectionIndex + '';
            $('.js-burger').removeClass('active');
            $('.mobile-nav').removeClass('active');
            $('html, body').stop().animate({
                scrollTop: $(navLink).offset().top
            }, 0);
        }
    });
    
    var indicator = new WheelIndicator({
        callback: function(e){
            if(e.direction == 'down'){
                nextSection();
            }else{
                prevSection();
            }
        },
        preventMouse: false
    });
    
    //mouse wheel event listener
    /*function MouseWheelHandler(e) {

        // cross-browser wheel delta
        var e = window.event || e;
        var wheelDirection = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if(wheelDirection === -1){
            nextSection();
        }else{
            prevSection();
        }

        return false;
    }
    var scrollListener = document.getElementsByClassName('js-scroll-event-listener');

    function addWheelEventListener(){
        for(var i=0;i<scrollListener.length;i++){
            scrollListener[i].addEventListener("mousewheel", MouseWheelHandler, false);
            scrollListener[i].addEventListener("DOMMouseScroll", MouseWheelHandler, false);
        }
    }
    function removeWheelEventListener(){
        for(var i=0;i<scrollListener.length;i++){
            scrollListener[i].removeEventListener("mousewheel", MouseWheelHandler, false);
            scrollListener[i].removeEventListener("DOMMouseScroll", MouseWheelHandler, false);
        }
    }    
    addWheelEventListener();*/
    
    //keydown event listener
    $(document).keydown(function(e) {
        switch(e.which) {
            case 38: // up
                prevSection();
            break;

            case 40: // down
                nextSection();
            break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    
    //swipe event listener
    var lastY;
    $(document).on('touchmove', function(e) {
        var currentY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
        if (currentY > lastY) {
            prevSection();
        } else {
            nextSection();
        }
        lastY = currentY;
    });
    
    //read more
    var readMoreLink;
    var articleLightbox;
    var articleScroll;
    var lightboxAnimatingFlag = false;
    $('.js-read-more').on('click', function(e){
        e.preventDefault();
        if(lightboxAnimatingFlag == false){
            lightboxAnimatingFlag = true;
            readMoreLink = $(this).attr('href');
            articleLightbox = $(readMoreLink);
            if($(this).hasClass('js-read-more--append')){
                $(this).removeClass('js-read-more--append');
                $('main').append(articleLightbox);
            }
            
            articleScroll = articleLightbox.find('.article__scroll');
            if (articleLightbox[0]!==void(0)) {
                articleLightbox.addClass('animate');
                articleLightbox.on(onTransitionEnd, function () {
                    lightboxAnimatingFlag = false;
                    articleLightbox.off(onTransitionEnd);
                });
                articleScroll.addClass('animate');
                //removeWheelEventListener();
                $('body').addClass('overflow--hidden');
            }
        }
    });
    $('.js-close-article').on('click', function(){
        if(lightboxAnimatingFlag == false){
            lightboxAnimatingFlag = true;
            articleLightbox.removeClass('animate');
            articleLightbox.on(onTransitionEnd, function(){
                //addWheelEventListener();
                $('body').removeClass('overflow--hidden');
                articleScroll.removeClass('animate');
                lightboxAnimatingFlag = false;
                articleLightbox.off(onTransitionEnd);
                articleLightbox = null;
                readMoreLink = null;
            });
        }
    });
    
    $('.article__scroll').impulse();
    
    //particles canvas
    var particleDensity;
    if(windoWidth > 768){
        particleDensity = 800;
    }else{
        particleDensity = 2500;
    }
    var particlesSettings = {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": particleDensity
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                },
                "image": {
                    "src": "",
                    "width": 100,
                    "height": 100
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.4,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 120,
                "color": "#ffffff",
                "opacity": 0.6,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": false,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": false,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 4,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 70,
                    "duration": 1000
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    }
    particlesJS('particles-js', particlesSettings);
    
    //menu
    $('.js-burger').on('click', function() {
        $(this).toggleClass('active');
        $('.mobile-nav').toggleClass('active');
    });
    
    var $frame = $('.js-frame');
    var $wrap = $frame.parent();

    // Call Sly on frame
    $frame.sly({
        horizontal: 1,
        itemNav: 'forceCentered',
        smart: 1,
        activateMiddle: 1,
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        pagesBar: $wrap.find('.pages'),
        activatePageOn: 'click',
        scrollBy: 1,
        speed: 300,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,

        // Buttons
        prev: $wrap.find('.prev'),
        next: $wrap.find('.next')
    });
    
    $(window).resize(function (e) {
        $frame.sly('reload');
    });
    
    $('#scene').parallax();
    
    /*$('.intro-loading').on(onTransitionEnd, function(){
        console.log(1);
        $('#section-2').addClass('active').addClass('animate');
        $('body').removeClass('overflow--hidden');
        addWheelEventListener();
    });*/
});