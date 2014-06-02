gsap-timeline-slider
=========

Lightweight slider for [GSAP] Timeline. Clean JavaScript, no external dependencies.

  - Start, pause, scrub
  - Change target timeline on the fly
  - Works in all modern browsers, IE9+

## Example
```
...
<div id="container"></div>
<script src="TimelineMax.js"></script>
<script src="gsap-timeline-slider.js"></script>
<script>
    ...
    var slider = new GSAPTLSlider(timeline, "container", {
        width: 300
    });
</script>
...
```
See working examples at [runbanner.com]

## API

### new GSAPTLSlider(timeline, elmentId, config);
Constructor.
* timeline - instance of TimelineLite or TimelineMax
* elementId - id of the slider html element
* config - configuration object with following properties:
    * style - style object for whole container
    * button - style object for play/pause button
    * rail - style object for sliders rail
    * thumb - tyle object for sliders thumb
    * width - width of the slider

### slider.container(element)
Changes container element of the slider.
* element - html element to use for the slider

### slider.timeline(timeline)
Changes targeted timeline.
* timeline - instance of TimelineLite or TimelineMax

### slider.width(width)
Changes the width of the slider.
* width - new width of the slider, in pixels

### slider.clear()
Removes event listeners and cleans the container.

License
----

MIT

[gsap]:http://www.greensock.com/gsap-js/
[runbanner.com]:http://runbanner.com/demos/

