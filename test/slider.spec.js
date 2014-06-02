
function addDiv(id) {
    var div = document.createElement('div'),
	att = document.createAttribute("id");

    att.value = id;
    div.setAttributeNode(att);
    document.body.appendChild(div);
}

addDiv('runbanner');
addDiv('slider');

rnb_runbanner.paused = true;
var runbanner = new RunBanner("runbanner", rnb_runbanner);

describe('class GSAPTLSlider', function () {
    var slider = new GSAPTLSlider(runbanner.tl, "slider", {
	width: 300
    });
    var el = slider.el;

    it('is instantiable', function () {
        expect(slider).to.be.an.instanceof(GSAPTLSlider);
    });
    it ('has expected public properties', function() {
        expect(slider).to.have.a.property('tl');
        expect(slider).to.have.a.property('config');
	expect(slider.clear).to.be.a('function');
	expect(slider.container).to.be.a('function');
	expect(slider.timeline).to.be.a('function');
    });
    it('is object merged to config', function () {
	expect(slider.config).to.have.a.property('width', 300);
    });
    describe("clear method", function() {
	var spy, slider2, spy2;
	
	before(function() {
	    spy = sinon.spy(slider, "onButton");
	    slider.clear();
	});

	it("should be empty", function() {
	    expect(el.children).to.have.length(0);
	});
	it("should not trigger events", function() {
	    Simulate.mouseup(slider.button);
	    spy.should.have.not.been.calledOnce;
	});

	it("should instantiate again", function() {
	    slider2 = new GSAPTLSlider(runbanner.tl, "slider", {
		width: 400
	    });
	    spy2 = sinon.spy(slider2, "onButton");
	    expect(slider2).to.be.an.instanceof(GSAPTLSlider);
	});
	it("trigger 2nd instance events", function() {
	
	    Simulate.mouseup(slider2.button);
	    spy.should.have.not.been.calledOnce;
	    spy2.should.have.been.calledOnce;
	});
	
	
	
    });	
    

});

