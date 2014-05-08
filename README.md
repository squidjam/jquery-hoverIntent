## What is hoverIntent?

        
hoverIntent is a plug-in that attempts to determine the user's intent... like a crystal ball, only with mouse movement! It is similar to [jQuery's hover method](http://api.jquery.com/hover/). However, instead of calling the handlerIn function immediately, hoverIntent waits until the user's mouse slows down enough before making the call.

        
Why? To delay or prevent the accidental firing of animations or ajax calls. Simple timeouts work for small areas, but if your target area is large it may execute regardless of intent. That's where hoverIntent comes in...
        
        
### jQuery's hover (for reference)

        <pre>$("#demo1 li").hover( makeTall, makeShort );</pre>
        <ul class="demo" id="demo1">
            <li class="p1">&nbsp;
            <li class="p2">&nbsp;
            <li class="p3">&nbsp;
            <li class="p4"><span>hover ignores over/out events from children</span>
        

        
jQuery's built-in hover calls handlerIn and handlerOut functions immediately. If you move your cursor back and forth quickly across the tiles you'll see how the immediate execution can lead to problems.

        
### .hoverIntent( handlerIn, handlerOut )

        <pre>$("#demo2 li").hoverIntent( makeTall, makeShort );</pre>
        <ul class="demo" id="demo2">
            <li class="p1">&nbsp;
            <li class="p2">&nbsp;
            <li class="p3">&nbsp;
            <li class="p4"><span>hoverIntent also ignores over/out events from children</span>
        

        
hoverIntent is interchangeable with jQuery's hover. It can use the same exact handlerIn and handlerOut functions. It passes the same **this** and **event** objects to those functions.

        
### .hoverIntent( handlerInOut )

        <pre>$("#demo3 li").hoverIntent( toggleHeight );</pre>
        <ul class="demo" id="demo3">
            <li class="p1">&nbsp;
            <li class="p2">&nbsp;
            <li class="p3">&nbsp;
            <li class="p4">&nbsp;
        

        
hoverIntent can also take a single handlerInOut, just like jQuery's hover.

        
### .hoverIntent( handlerIn, handlerOut, selector )

        <pre>$("#demo4").hoverIntent( makeTall, makeShort, 'li' );</pre>
        <ul class="demo" id="demo4">
            <li class="p1">&nbsp;
            <li class="p2">&nbsp;
            <li class="p3">&nbsp;
            <li class="p4">&nbsp;
        

        
Unlike jQuery's hover, hoverIntent supports event delegation! Just pass in a selector of a descendant element.

        
### .hoverIntent( handlerInOut, selector )

        <pre>$("#demo5").hoverIntent( toggleHeight, 'li' );</pre>
        <ul class="demo" id="demo5">
            <li class="p1">&nbsp;
            <li class="p2">&nbsp;
            <li class="p3">&nbsp;
            <li class="p4">&nbsp;
        

        
Unlike jQuery's hover, hoverIntent supports event delegation with handlerInOut.

        
### .hoverIntent( object )

<pre>
$("#demo6").hoverIntent({
    mouseenter: makeTall,
    mouseleave: makeShort,
    selector: 'li'
});
</pre>
        <ul class="demo" id="demo6">
            <li class="p1">&nbsp;
            <li class="p2">&nbsp;
            <li class="p3">&nbsp;
            <li class="p4">&nbsp;
        

        
To control hoverIntent more precisely and override the default configuration options, pass it an object as the first parameter. The object must at least contain a "mouseenter" function. If the "mouseenter" function is sent alone, it will act just like handlerInOut.

        
## Common Configuration Options

        
These are the common options you'll want to use. Note, nothing prevents you from sending [an empty function](http://api.jquery.com/jQuery.noop/) as the handlerIn or handlerOut functions.

        
### mouseenter:

        
Required. The handlerIn function you'd like to call on "mouseenter with intent". Your function receives the same "this" and "event" objects as it would from jQuery's hover method. If the "mouseenter" function is sent alone (without "mouseleave") then it will be used in both cases like the handlerInOut param.

        
### mouseleave:

        
The handlerOut function you'd like to call on "mouseleave after timeout". Your function receives the same "this" and "event" objects as it would from jQuery's hover method. Note, hoverIntent will only call the "mouseleave" function if the "mouseenter" function has been called.

        
### timeout:

        
A simple delay, in milliseconds, before the "mouseleave" function is called. If the user mouses back over the element before the timeout has expired the "out" function will not be called (nor will the "over" function be called). This is primarily to protect against sloppy/human mousing trajectories that temporarily (and unintentionally) take the user off of the target element... giving them time to return. _Default timeout: 0_

        
### selector:

        
A selector string for event delegation. Used to filter the descendants of the selected elements that trigger the event. If the selector is null or omitted, the event is always triggered when it reaches the selected element. Read [jQuery's API Documentation for the .on() method](http://api.jquery.com/on/#direct-and-delegated-events) for more information.

        
## Advanced Configuration Options

        
Modify these if you are brave, test tirelessly, and completely understand what you are doing. When choosing the default settings for hoverIntent I tried to find the best possible balance between responsiveness and frequency of false positives.

        
### sensitivity:

        
If the mouse travels fewer than this number of pixels between polling intervals, then the "mouseenter" function will be called. With the minimum sensitivity threshold of 1, the mouse must not move between polling intervals. With higher sensitivity thresholds you are more likely to receive a false positive. _Default sensitivity: 6_

        
### interval:

        
The number of milliseconds hoverIntent waits between reading/comparing mouse coordinates. When the user's mouse first enters the element its coordinates are recorded. The soonest the "over" function can be called is after a single polling interval. Setting the polling interval higher will increase the delay before the first possible "over" call, but also increases the time to the next point of comparison. _Default interval: 100_

        
## Known Defects {#defects}

        
hoverIntent r5 suffers from [a defect in Google Chrome that improperly triggers mouseout when entering a child input[type="text"] element](http://code.google.com/p/chromium/issues/detail?id=68629). hoverIntent r6 uses the same mouseenter/mouseleave special events as jQuery's built-in hover, and jQuery 1.5.1 patched this issue. Thanks to Colin Stuart for tipping me off about this and for providing isolated code to demonstrate/test.

 However, if you were using Google Chrome and if this page were using an older version of jQuery or hoverIntent, moving the cursor over the text input would improperly trigger the mouseout event, and the value would change to "leave parent".

If you place an element flush against the edge of the browser chrome, sometimes Internet Explorer does not trigger a "mouseleave" event if your cursor leaves the element/browser in that direction. hoverIntent cannot correct for this.

## Release History

            * r7remix = (2014) 
            Includes fixes and improvements from:
            
                * [usmonster] euclidean motion measurements
                * [voigtan] viewport, ignoreScroll support
                * [lucanos] extended options handler to allow passing of mouseenter and mouseout
                * [somatonic] touchend support
                * [rowofpixels] jQuery reference consistency
            based on r7 original from [briancherne]
            
            * r7 = (2013) Added event delegation via "selector" param/property. Added namespaced events for better isolation. Added handlerInOut support.
            * r6 = (2011) Identical to r5 except that the Google Chrome defect is fixed once you upgrade to jQuery 1.5.1 (or later).
            * r5 = (2007) Added state to prevent unmatched function calls. This and previous releases suffer from [a defect in Google Chrome that improperly triggers mouseout when entering a child input[type=text] element](http://code.google.com/p/chromium/issues/detail?id=68861).
            * r4 = Fixed polling interval timing issue (now uses a self-calling timeout to avoid interval irregularities).
            * r3 = Developer-only release for debugging.
            * r2 = Added timeout and interval references to DOM object -- keeps timers separate from each other. Added configurable options. Added timeout option to delay onMouseLeave function call. Fixed two-interval mouseOver bug (now setting pX and pY onMouseEnter instead of hardcoded value).
            * r1 = Initial release to jQuery discussion forum for feedback.
