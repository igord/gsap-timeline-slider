// gsap-timeline-slider v0.1
//
// Author: Igor Dimitrijevic <igor@ground.gr>
// Distributed under MIT License
//
(function() {
    "use strict";
    window.GSAPTLSlider = function (tl, id, cnf) {
	this.config = {	
	    style: {
		display: 'inline-block',
		cursor: 'pointer',
		paddingTop: '2px',
		webkitUserSelect: 'none',
		mozUserSelect: 'none',
		msUserSelect: 'none',
		userSelect: 'none'
	    },
	    button: {
		color: 'black',
		margin: 0,
		padding: '4px 0 0 4px',
		verticalAlign: 'middle',
		display: 'inline-block',
	    },
	    rail: {
		backgroundColor: '#999',
		width: '220px',
		height: '1px',
		marginBottom: '3px',
		marginLeft: '6px',
		verticalAlign: 'middle',
		display: 'inline-block'
	    },
	    thumb: {
		backgroundColor: 'black',
		width: '2px',
		height: '9px',
		padding: 0,
		margin: 0,
		top: '7px',
		verticalAlign: 'top',
		display: 'inline-block',
		position: 'relative'
	    },
	    width: 0
	};
	merge(this.config, cnf);
	this.container(document.getElementById(id));
	this.timeline(tl);
    }
    var pt = {
	container: function(el) {
	    if (this.el) {
		this.el.innerHTML = '';
		this.button.removeEventListener('mouseup', proxy(this, 'onButton'));
		this.el.removeEventListener('mousedown', proxy(this, 'onDown'));
	    }
	    el.innerHTML = '';

	    this.el = el;
	    this.button = document.createElement('div');
	    this.rail = document.createElement('div');
	    this.thumb = document.createElement('div');
	    this.play = svgPlay(this.config.button.color);
	    this.pause = svgPause(this.config.button.color);

	    this.button.appendChild(this.play);
	    merge(this.button.style, this.config.button);
	    this.el.appendChild(this.button);

	    if (this.config.width) {
		this.railW = this.config.width - (this.button.offsetWidth + parseInt(this.config.rail.marginLeft, 10));
		this.railW -= parseInt(this.config.thumb.width, 10);
		merge(this.rail.style, this.config.rail, {width: this.railW + "px"});
	    } else {
		this.railW = parseInt(this.config.rail.width);
		merge(this.rail.style, this.config.rail);
	    }
	    this.el.appendChild(this.rail);
	    merge(this.thumb.style, this.config.thumb, {left: "-" + this.railW + "px"});
	    this.el.appendChild(this.thumb);
	    merge(this.el.style, this.config.style);

	    this.button.addEventListener('mouseup', proxy(this, 'onButton'));
	    this.el.addEventListener('mousedown', proxy(this, 'onDown'));
	},
	onButton: function(ev) {
	    this.toggle(!this.tl.paused());
	    this.tl.paused(!this.tl.paused());
	},
	toggle: function(p) {
	    this.button.innerHTML = '';
	    this.button.appendChild(p? this.play : this.pause);
	},
	onDown: function(ev) {
	    if (ev.offsetX > this.button.offsetWidth) {
		this.onMove(ev);
		window.addEventListener('mousemove', proxy(this, 'onMove'));
		window.addEventListener('mouseup', proxy(this, 'onUp'));
		this.wasPlaying = !this.tl.paused();
		if (this.wasPlaying) {
		    this.tl.pause();
		    //this.toggle(true);
		}    
	    }
	},
	onMove: function(ev) {
	    var railOffset = this.rail.getBoundingClientRect().left + window.pageXOffset;
	    var x = ev.pageX - railOffset - this.railW;
	    if (x > 0 || x < -this.railW) return;
	    this.thumb.style.left = Math.round(x) + "px";
	    this.tl.time(this.tl.duration() + (this.tl.duration() * x / this.railW));
	},
	onUp: function(ev) {
	    window.removeEventListener('mousemove', proxy(this, 'onMove'));
	    window.removeEventListener('mouseup', proxy(this, 'onUp'));
	    if (this.wasPlaying) {
		this.tl.play();
		this.toggle(false);
	    }
	},
	width: function(v) {
	    this.config.width = v;
	    this.container(this.el);
	},
	timeline: function(tl) {
	    if (this.tl) {
		this.wasPlaying = !this.tl.paused();
		this.tl.pause();
		this.spy(true);
	    }
	    this.tl = tl;
	    this.spy();
	    this.tl.time(0);
	    if (this.wasPlaying) {
		this.tl.play();
		this.toggle(false);
	    }
	},
	old: {},
	spy: function(unspy) {
	    if (unspy) {
		this.doOld('start', 'remove');
		this.doOld('update', 'remove');
		this.doOld('complete', 'remove');
	    } else {
		this.doOld('start');
		this.doOld('update');
		this.doOld('complete');
	    }
	},
	doOld: function(type, task) {
	    var gsType = 'on' + type.substr(0, 1).toUpperCase() + type.substr(1);
	    if (task === "remove") {
		if (this.old[type]) {
		    this.tl.eventCallback(gsType, this.old[type].f, this.old[type].p, this.old[type].c);
		    delete(this.old[type]);
		} else this.tl.eventCallback(gsType, null);
	    } else {
		if (this.tl.vars[gsType]) this.old[type] = {
		    f: this.tl.vars[gsType],
		    p: this.tl.vars[gsType + 'Params'],
		    c: this.tl.vars[gsType + 'Scope']
		};
		this.tl.eventCallback(gsType, this[gsType], [], this);
	    }
	},
	onStart: function() {
	    this.toggle(false);
	    var o = this.old.start;
	    if (o) o.f.apply(o.c, o.p);
	},
	onUpdate: function() {
	    //this.tl.duration : this.railW = this.tl.time : x
	    var x = (this.railW * this.tl.time()) / this.tl.duration();
	    this.thumb.style.left = (-this.railW + x) + "px";
	    var o = this.old.update;
	    if (o) o.f.apply(o.c, o.p);
	},
	onComplete: function() {
	    this.tl.time(0);
	    this.tl.pause();
	    this.toggle(true);
	    var o = this.old.complete;
	    if (o) o.f.apply(o.c, o.p);
	},
	clear: function() {
	    this.spy(true);
	    this.button.removeEventListener('mouseup', proxy(this, 'onButton'));
	    this.el.removeEventListener('mousedown', proxy(this, 'onDown'));
	    this.el.innerHTML = '';
	    cleanProxy(this);
	}
    };
    for (var k in pt) window.GSAPTLSlider.prototype[k] = pt[k];
    // UTILS
    function merge(target) {
	for (var i = 1; i < arguments.length; i++) {
	    for (var k in arguments[i]) target[k] = arguments[i][k];
	}
    };
    var proxied = {};
    function proxy(ctx, key) {
	if (proxied[key]) {
	    for (var i = 0; i < proxied[key].length; i++) if (proxied[key][i].ctx === ctx) return proxied[key][i].f;
	} else proxied[key] = [];

	var f = function() {
	    ctx[key].apply(ctx, arguments);
	};
	proxied[key].push({
	    ctx: ctx,
	    f: f
	});
	return f;	
    };
    function cleanProxy(c) {
	var k, i;
	for (k in proxied) {
	    for (i = 0; i < proxied[k].length; i++) {
		if (proxied[k][i].ctx = c) {
		    proxied[k].splice(i, 1);
		    if (!proxied[k].length) delete(proxied[k]);
		    break;
		}
	    }
	}
    };
    function createEl(tag, att) {
	var el = document.createElementNS('http://www.w3.org/2000/svg', tag), k, a;
	for (k in att) {
	    a = document.createAttribute(k);
	    a.value = att[k];
	    el.setAttributeNode(a);
	}
	return el;
    };
    function svgPlay(color) {
	var svg = createEl('svg', {width: 12, height: 16}),
	    poly = createEl('polygon', {points: '0,0 12,8 0,16', style: 'fill:' + color});
	svg.appendChild(poly);
	
	return svg;
    }
    function svgPause(color) {
	var svg = createEl('svg', {width: 12, height: 16}),
	    rect = createEl('rect', {width: 5, height: 16, style: 'fill:' + color}),
	    rect2 = createEl('rect', {x: 7, width: 5, height: 16, style: 'fill:' + color});
	svg.appendChild(rect);
	svg.appendChild(rect2);
	
	return svg;
    }
})();
