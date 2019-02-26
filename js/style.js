// ***********  sticky navigation  ***************
// ************************************************ 

window.onscroll = function() {
    myFunction()
};

var header = document.getElementById("menu-nav");
var sticky = header.offsetTop;

function myFunction() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}

// ***********  smooth scroll  ***************
// ************************************************ 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ***********  mouse move special section  ***************
// ************************************************ 

var lFollowX = 0,
    lFollowY = 0,
    x = 0,
    y = 0,
    friction = 1 / 30;

function moveBackground() {
    x += (lFollowX - x) * friction;
    y += (lFollowY - y) * friction;

    //  translate = 'translateX(' + x + 'px, ' + y + 'px)';
    translate = 'translateX(' + x + 'px) translateY(' + y + 'px)';

    $('.cta').css({
        '-webit-transform': translate,
        '-moz-transform': translate,
        'transform': translate
    });

    window.requestAnimationFrame(moveBackground);
}

$(window).on('mousemove click', function(e) {
    if (!$(e.target).hasClass('cta')) {
        var lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX)),
            lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));

        lFollowX = (20 * lMouseX) / 100;
        lFollowY = (10 * lMouseY) / 100;
    }
});

moveBackground();

// ***********  active menu links  ***************
// ************************************************ 

$(document).ready(function() {
    $home = $('.m-home');
    $about = $('.m-about');
    $chefs = $('.m-chefs');
    $menu = $('.m-menu');
    $gallery = $('.m-gallery');
    $contact = $('.m-contact');

    $home.click(function() {
        $home.addClass('active');
        $('.m-about, .m-chefs, .m-menu, .m-gallery, .m-contact').removeClass('active');
    });

    $about.click(function() {
        $about.addClass('active');
        $('.m-home, .m-chefs, .m-menu, .m-gallery, .m-contact').removeClass('active');
    });

    $chefs.click(function() {
        $chefs.addClass('active');
        $('.m-home, .m-about, .m-menu, .m-gallery, .m-contact').removeClass('active');
    });

    $menu.click(function() {
        $menu.addClass('active');
        $('.m-home, .m-about, .m-chefs, .m-gallery, .m-contact').removeClass('active');
    });

    $gallery.click(function() {
        $gallery.addClass('active');
        $('.m-home, .m-about, .m-chefs, .m-menu, .m-contact').removeClass('active');
    });

    $contact.click(function() {
        $contact.addClass('active');
        $('.m-home, .m-about, .m-chefs, .m-menu, .m-gallery').removeClass('active');
    });
});


// ***********  animated headlines  ***************
// ************************************************ 

jQuery(document).ready(function($) {

    // set animation timing
    var animationDelay = 2500,
        // loading bar effect
        barAnimationDelay = 3800,
        barWaiting = barAnimationDelay - 3000, // 3s is the duration of the transition on the loading bar - set in CSS
        // letters effect
        lettersDelay = 50;

    initHeadline();

    function initHeadline() {
        // insert <i> element for each letter of a changing word
        singleLetters($('.cd-headline.letters').find('b'));
        // initialise headline animation
        animateHeadline($('.cd-headline'));
    }

    function singleLetters($words) {
        $words.each(function() {
            var word = $(this),
                letters = word.text().split(''),
                selected = word.hasClass('is-visible');
            for (i in letters) {
                if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
            }
            var newLetters = letters.join('');
            word.html(newLetters);
        });
    }

    function animateHeadline($headlines) {
        var duration = animationDelay;
        $headlines.each(function() {
            var headline = $(this);
            var spanWrapper = headline.find('.cd-words-wrapper'),
                newWidth = spanWrapper.width() + 5;
            spanWrapper.css('width', newWidth);
            if (headline.hasClass('loading-bar')) {
                duration = barAnimationDelay;
                spanWrapper.css('width', '');
                setTimeout(function() { spanWrapper.addClass('is-loading') }, barWaiting);
            };
            //trigger animation
            setTimeout(function() { hideWord(headline.find('.is-visible').eq(0)) }, duration);
        });
    }

    function hideWord($word) {
        var nextWord = takeNext($word);
        if ($word.parents('.cd-headline').hasClass('letters')) {
            var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
            hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
            showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);
        } else if ($word.parents('.cd-headline').hasClass('loading-bar')) {
            $word.parents('.cd-words-wrapper').removeClass('is-loading');
            switchWord($word, nextWord);
            setTimeout(function() { hideWord(nextWord) }, barAnimationDelay);
            setTimeout(function() { $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
        } else {
            switchWord($word, nextWord);
            setTimeout(function() { hideWord(nextWord) }, animationDelay);
        }
    }

    function hideLetter($letter, $word, $bool, $duration) {
        $letter.removeClass('in').addClass('out');
        if (!$letter.is(':last-child')) {
            setTimeout(function() { hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
        } else if ($bool) {
            setTimeout(function() { hideWord(takeNext($word)) }, animationDelay);
        }
        if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
            var nextWord = takeNext($word);
            switchWord($word, nextWord);
        }
    }

    function showLetter($letter, $word, $bool, $duration) {
        $letter.addClass('in').removeClass('out');
        if (!$letter.is(':last-child')) {
            setTimeout(function() { showLetter($letter.next(), $word, $bool, $duration); }, $duration);
        } else {
            if (!$bool) { setTimeout(function() { hideWord($word) }, animationDelay) }
        }
    }

    function takeNext($word) {
        return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
    }

    function takePrev($word) {
        return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
    }

    function switchWord($oldWord, $newWord) {
        $oldWord.removeClass('is-visible').addClass('is-hidden');
        $newWord.removeClass('is-hidden').addClass('is-visible');
    }

});

// ***********  booking form  ***************
// ************************************************ 
function submitBooking() {
    var name = $( "input[name='customer_name']" ),
        phone = $( "input[name='phone_number']" );
    if(name.val() == '') {
        name.addClass('highlight')
    } else {
        name.removeClass('highlight')
    };

    if(phone.val() == '') {
        phone.addClass('highlight')
    } else {
        phone.removeClass('highlight')
    };
};

function clearHighlight(id) {
    $('#'+id).removeClass('highlight');
};

function focusInput(id) {
    var label = $( "label[for=" + id + "]" );
    label.addClass('input--selected')
};