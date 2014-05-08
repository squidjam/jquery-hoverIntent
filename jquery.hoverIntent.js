/*!
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2013 Brian Cherne
 */
 
/* hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * // basic usage ... just like .hover()
 * .hoverIntent( handlerIn, handlerOut )
 * .hoverIntent( handlerInOut )
 *
 * // basic usage ... with event delegation!
 * .hoverIntent( handlerIn, handlerOut, selector )
 * .hoverIntent( handlerInOut, selector )
 *
 * // using a basic configuration object
 * .hoverIntent( config )
 *
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 */
(function($) {
    $.fn.hoverIntent = function(handlerIn,handlerOut,selector) {

        // default configuration values
        var settings = {};
        var defaults = {
            interval: 100,
            sensitivity: 6,
            timeout: 0,
            ignoreScroll: false,
            mouseenter: function(){},
            mouseleave: function(){},
            selector: null
        };
        switch( typeof handlerIn ){
            case "object" :
                settings = $.extend(defaults, handlerIn );
                break;
            case "function" :
                settings = $.extend(defaults, { mouseenter: handlerIn } );
                break;
        }

        switch( typeof handlerOut ){
            case "function" :
                settings = $.extend(defaults, { mouseleave: handlerOut } );
                break;
            case "string" :
            case "object" :
                settings = $.extend(defaults, { mouseleave: handlerIn, selector: handlerOut } );
        }
        if( typeof selector ){
            settings = $.extend(defaults, { selector: selector } );
        }

        // instantiate variables
        // viewport = reference viewport for mouse position, either "page" (layout) or "client" (visual) - [voigtan]
        // X, Y = event properties used to get position of mouse - [voigtan]
        // cX, cY = current X and Y position of mouse, updated by mousemove event
        // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
        // scrolling = true if scrolled recently without moving the mouse, false otherwise - [voigtan]
        var viewport = settings.ignoreScroll ? "client" : "page";
        var X = viewport + "X", Y = viewport + "Y";
        var cX, cY, pX, pY, scrolling = false;

        // A private function for getting mouse position
        var track = function(ev) {
            cX = ev.pageX;
            cY = ev.pageY;
        };

        // A private function for comparing current and previous mouse position
        var compare = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            // compare mouse positions to see if they've crossed the threshold
            // includes euclidean motion measurements - [usmonster]
            if ( Math.sqrt( (pX-cX)*(pX-cX) + (pY-cY)*(pY-cY) ) < settings.sensitivity ) {
                $(ob).off("mousemove.hoverIntent",track);
                // set hoverIntent state to true (so mouseOut can be called)
                ob.hoverIntent_s = true; // - [usmonster]
                return settings.mouseenter.apply(ob,[ev]);
            } else {
                // set previous coordinates for next time
                pX = cX; pY = cY;
                // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
                ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , settings.interval );
            }
        };

        // A private function for detecting if the user is scrolling - [voigtan]
        var detectScroll = $.proxy(function() {
            scrolling = true;
            // set scrolling back to false after first mousemove
            this.one({"mousemove.hoverIntent": function(){ scrolling = false;} }, settings.selector);
        }, this);

        // A private function for delaying the mouseOut function
        var delay = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = 0;
            return settings.mouseleave.apply(ob,[ev]);
        };

        // A private function for handling mouse 'hovering'
        var handleHover = function(e) {
            // copy objects to be passed into t (required for event object to be passed in IE)
            var ev = $.extend({},e); // Reference jQuery consisntently - [rowofpixels]
            var ob = this;

            // cancel hoverIntent timer if it exists
            if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

            // if e.type == "mouseenter"
            if (e.type === "mouseenter") {
                // don't do anything while scrolling - [voigtan]
                if (scrolling) { return; }
                // set "previous" X and Y position based on initial entry point
                pX = ev.pageX; pY = ev.pageY;
                // update "current" X and Y position based on mousemove
                $(ob).on("mousemove.hoverIntent",track);
                // start polling interval (self-calling timeout) to compare mouse coordinates over time
                if (!ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , settings.interval );}

                // else e.type == "mouseleave"
            } else if(e.type === "mouseleave") {
                // unbind expensive mousemove event
                $(ob).off("mousemove.hoverIntent",track);
                // if hoverIntent state is true, then call the mouseOut function after the specified delay
                if (ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , settings.timeout );}
            }
            // if touch event we don't need intent
            if(e.type === "touchend"){
                settings.mouseenter.apply(ob,[ev]);
            }
        };
        
        // listen for scroll event, if we want to ignore it - [voigtan]
        if (settings.ignoreScroll) { $(window).on('scroll.hoverIntent', detectScroll); }
        // listen for mouseenter and mouseleave
        return this.on({'mouseenter.hoverIntent':handleHover,
                        'mouseleave.hoverIntent':handleHover, 
                        'touchend.hoverIntent':handleHover
                    }, settings.selector);
    }
})(jQuery);
