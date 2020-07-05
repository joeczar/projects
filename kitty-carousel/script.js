(function () {
    var kitties = document
        .getElementById('carousel')
        .getElementsByTagName('img');
    var dots = document.getElementsByClassName('dot');
    var timer;
    var cur = 0;
    var transitionIsHappening;

    document.addEventListener('transitionend', function (e) {
        if (e.target.classList.contains('exit')) {
            e.target.classList.remove('exit');
            timer = setTimeout(moveKitties, 5000);
            transitionIsHappening = false;
        }
    });

    // touch set up http://www.javascriptkit.com/javatutors/touchevents.shtml

    var body = document.querySelector('body');
    var startx = 0;
    var dist = 0;

    body.addEventListener(
        'touchstart',
        function (e) {
            var touchObj = e.changedTouches[0]; // reference 1st finger
            startx = parseInt(touchObj.clientX); // get x pos of touch point
            e.preventDefault();
        },
        false
    );

    body.addEventListener(
        'touchmove',
        function (e) {
            var touchObj = e.changedTouches[0]; // first touch point of this event
            dist = parseInt(touchObj.clientX) - startx;

            e.preventDefault();
        },
        false
    );

    // body.addEventListener('touchcancel', processTouchcancel, false);
    // body.addEventListener(
    //     'touchend',
    //     function (e) {
    //         var touchObj = e.changedTouches[0]; // first touch point for this event
    //         console.log({ touchObj });

    //         e.preventDefault();
    //     },
    //     false
    // );

    // touchstart handler

    // for (var i = 0; i < dots.length; i++) {
    //     dots[i].addEventListener('click', function(e) {
    //         clearTimeout(timer);
    //          console.log(e.target);

    //     });
    // }

    // for (var i = 0; i < dots.length; i++) {
    //     dots[i].addEventListener('click', function (e) {
    //         clearTimeout(timer);
    //         for (var i = 0; i < dots.length; i++) {
    //             if(dots[i] == e.target) {
    //                 break;
    //             }
    //         }
    //         console.log(i)
    //     });
    // }

    // for (var i = 0; i < dots.length; i++) {
    //     (function (index) {
    //         dots[i].addEventListener('click', function (e) {
    //             clearTimeout(timer);
    //             console.log(e.target);
    //         })(i);
    //     });
    // }

    for (var i = 0; i < dots.length; i++) {
        addClickHandler(dots[i], i);
        swipeKitty();
    }

    function swipeKitty() {
        body.addEventListener('touchmove', function (e) {
            var touchObj = e.changedTouches[0]; // first touch point for this event
            // if touch end event is triggered and touch move is negative
            if (touchObj && dist < 0) {
                if (transitionIsHappening) {
                    return;
                }
                clearTimeout(timer);

                var next = cur === 3 ? 0 : cur + 1;
                
                moveKitties(next);
            }

            e.preventDefault();
        });
    }

    function addClickHandler(dot, index) {
        dot.addEventListener('click', function (e) {
            console.log(index);
            // check if dot clicked is active kitty
            if (index == cur) {
                return;
            }
            if (transitionIsHappening) {
                return;
            }
            clearTimeout(timer);
            moveKitties(index);
        });
    }

    timer = setTimeout(moveKitties, 5000);

    function moveKitties(next) {
        transitionIsHappening = true;
        // remove onscreen from "cur" and add exit;
        kitties[cur].classList.remove('show');
        kitties[cur].classList.add('exit');
        dots[cur].classList.remove('on');

        if (typeof next == 'undefined') {
            cur++;
            if (cur >= kitties.length) {
                cur = 0;
            }
        } else {
            cur = next;
        }

        kitties[cur].classList.add('show');
        dots[cur].classList.add('on');
    }
    // transitionend event
})();
