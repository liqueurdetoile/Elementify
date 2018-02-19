import {Element} from 'index';

describe('Element Class', function () {

  var html = ['a', 'abbr', 'acronym', 'address', 'applet', 'h1'];
  var formElements = ['input', 'select', 'button', 'textarea'];

  it('should create a DocumentFragment in case of void input', function () {
    var e = new Element();

    e.node.nodeType.should.equal(11);
  });

  html.forEach(function (tag) {
    describe('HtmlElement creation : ' + tag, function () {
      it('should create HtmlElement from ' + tag + ' string tag name', function () {
        var e = new Element(tag);

        e.enhanced.should.equal(true);
        e.node.nodeName.should.equal(tag.toUpperCase());
      });

      it('should create HtmlElement from ' + tag + ' node', function () {
        var e = new Element(document.createElement(tag));

        e.enhanced.should.equal(true);
        e.node.nodeName.should.equal(tag.toUpperCase());
      });

      it('should create HtmlElement from ' + tag + ' string', function () {
        var e = new Element('<' + tag + '></' + tag + '>');

        e.enhanced.should.equal(true);
        e.node.nodeName.should.equal(tag.toUpperCase());
      });

      it('should create Collection from ' + tag + ' string', function () {
        var e = new Element('<' + tag + '></' + tag + '><' + tag + '></' + tag + '>');

        e.length.should.equal(2);
      });

      it('should returns same HtmlElement when HtmlElement given in arguments', function () {
        var e = new Element(tag);
        var f = new Element(e);

        e.enhanced.should.equal(true);
        (e === f).should.equal(true);
      });

      it('should returns same Collection when Collection given in arguments', function () {
        var e = new Element('<' + tag + '></' + tag + '><' + tag + '></' + tag + '>');
        var f = new Element(e);

        (e === f).should.equal(true);
      });
    });
  });

  describe('Form creation', function () {
    it('should create Form from string', function () {
      var e = new Element('form');

      expect(typeof e.validate).to.equal('function');
      e.node.nodeName.should.equal('FORM');
    });
  });

  formElements.forEach(function (tag) {
    describe('FormElement creation : ' + tag, function () {
      it('should create FormElement from ' + tag + ' string tag name', function () {
        var e = new Element(tag);

        e.node.nodeName.should.equal(tag.toUpperCase());
        expect(typeof e.validate).to.equal('function');
      });

      it('should create FormElement from ' + tag + ' node', function () {
        var e = new Element(document.createElement(tag));

        e.node.nodeName.should.equal(tag.toUpperCase());
        expect(typeof e.validate).to.equal('function');
      });

      it('should create FormElement from ' + tag + ' string', function () {
        var e = new Element('<' + tag + '></' + tag + '>');

        e.node.nodeName.should.equal(tag.toUpperCase());
        expect(typeof e.validate).to.equal('function');
      });

      it('should create Collection from ' + tag + ' string', function () {
        var e = new Element('<' + tag + '></' + tag + '><' + tag + '></' + tag + '>');

        e.length.should.equal(2);
      });

      it('should returns same FormElement when FormElement given in arguments', function () {
        var e = new Element(tag);
        var f = new Element(e);

        (e === f).should.equal(true);
      });

      it('should returns same Collection when Collection given in arguments', function () {
        var e = new Element('<' + tag + '></' + tag + '><' + tag + '></' + tag + '>');
        var f = new Element(e);

        (e === f).should.equal(true);
      });
    });
  });
});
