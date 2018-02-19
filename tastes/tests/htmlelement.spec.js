import {Element, Q} from 'index';

describe('HTMLElement Class', function () {

  beforeEach(function () {
    var e = new Element('div', {
      class: 'fixture',
      id: 'fixture',
      innerHTML: 'fixture'
    });

    document.body.appendChild(e.node);
  });

  afterEach(function () {
    Q('#fixture').remove();
  });

  describe('forEach', function () {
    it('should runs callback', function () {
      Q('#fixture').forEach(function (el, i) {
        el.node.id.should.equal('fixture');
        i.should.equal(0);
      });
    });
  });

  describe('Attributes and Data Attributes', function () {
    it('should set a single attribute', function () {
      Q('#fixture').attr('fixture', 'fixture');
      Q('#fixture').node.getAttribute('fixture').should.equal('fixture');
    });
    it('should get a single attribute', function () {
      Q('#fixture').attr('fixture', 'fixture');
      Q('#fixture').attr('fixture').should.equal('fixture');
    });
    it('should remove a single attribute', function () {
      Q('#fixture').attr('fixture', null);
      expect(Q('#fixture').node.getAttribute('fixture')).to.equal(null);
    });
    it('should create multiple attributes', function () {
      Q('#fixture').attr({
        fixture1: 'fixture1',
        fixture2: 'fixture2',
        fixture3: 'fixture3'
      });
      Q('#fixture').node.getAttribute('fixture1').should.equal('fixture1');
      Q('#fixture').node.getAttribute('fixture2').should.equal('fixture2');
      Q('#fixture').node.getAttribute('fixture2').should.equal('fixture2');
    });
    it('should get multiple attributes', function () {
      Q('#fixture').attr({
        fixture1: 'fixture1',
        fixture2: 'fixture2',
        fixture3: 'fixture3'
      });
      var r = Q('#fixture').attr(['fixture1', 'fixture2', 'fixture3']);

      expect(r).to.eql({
        fixture1: 'fixture1',
        fixture2: 'fixture2',
        fixture3: 'fixture3'
      });
    });
    it('should edit multiple attributes', function () {
      Q('#fixture').attr({
        fixture1: 'fixture1',
        fixture2: 'fixture2',
        fixture3: 'fixture3'
      });
      Q('#fixture').attr({
        fixture1: 'fixture1m',
        fixture2: 'fixture2m',
        fixture3: 'fixture3m'
      });
      Q('#fixture').node.getAttribute('fixture1').should.equal('fixture1m');
      Q('#fixture').node.getAttribute('fixture2').should.equal('fixture2m');
      Q('#fixture').node.getAttribute('fixture2').should.equal('fixture2m');
    });
    it('should remove multiple attributes', function () {
      Q('#fixture').attr({
        fixture1: 'fixture1',
        fixture2: 'fixture2',
        fixture3: 'fixture3'
      });
      Q('#fixture').attr({
        fixture1: null,
        fixture2: null,
        fixture3: null
      });
      expect(Q('#fixture').node.getAttribute('fixture1')).to.equal(null);
      expect(Q('#fixture').node.getAttribute('fixture2')).to.equal(null);
      expect(Q('#fixture').node.getAttribute('fixture3')).to.equal(null);
    });
    it('should get all attributes', function () {
      var r = Q('#fixture').attr();

      r.should.eql({
        class: 'fixture',
        id: 'fixture'
      });
    });

    it('should set a single data attribute', function () {
      Q('#fixture').data('fixture', 'fixture');
      Q('#fixture').node.getAttribute('data-fixture').should.equal('fixture');
    });
    it('should get a single attribute', function () {
      Q('#fixture').data('fixture', 'fixture');
      Q('#fixture').data('fixture').should.equal('fixture');
    });
    it('should remove a single data attribute', function () {
      Q('#fixture').data('fixture', null);
      expect(Q('#fixture').node.getAttribute('data-fixture')).to.equal(null);
    });
    it('should create multiple data attributes', function () {
      Q('#fixture').data({
        fixture1: 'fixture1',
        fixture2: 'fixture2',
        fixture3: 'fixture3'
      });
      Q('#fixture').node.getAttribute('data-fixture1').should.equal('fixture1');
      Q('#fixture').node.getAttribute('data-fixture2').should.equal('fixture2');
      Q('#fixture').node.getAttribute('data-fixture2').should.equal('fixture2');
    });
    it('should get multiple data attributes', function () {
      Q('#fixture').data({
        fixture1: 'fixture1',
        fixture2: 'fixture2',
        fixture3: 'fixture3'
      });
      var r = Q('#fixture').data(['fixture1', 'fixture2', 'fixture3']);

      expect(r).to.eql({
        fixture1: 'fixture1',
        fixture2: 'fixture2',
        fixture3: 'fixture3'
      });
    });
    it('should edit multiple data attributes', function () {
      Q('#fixture').data({
        fixture1: 'fixture1',
        fixture2: 'fixture2',
        fixture3: 'fixture3'
      });
      Q('#fixture').data({
        fixture1: 'fixture1m',
        fixture2: 'fixture2m',
        fixture3: 'fixture3m'
      });
      Q('#fixture').node.getAttribute('data-fixture1').should.equal('fixture1m');
      Q('#fixture').node.getAttribute('data-fixture2').should.equal('fixture2m');
      Q('#fixture').node.getAttribute('data-fixture2').should.equal('fixture2m');
    });
    it('should remove multiple data attributes', function () {
      Q('#fixture').data({
        fixture1: 'fixture1',
        fixture2: 'fixture2',
        fixture3: 'fixture3'
      });
      Q('#fixture').data({
        fixture1: null,
        fixture2: null,
        fixture3: null
      });
      expect(Q('#fixture').node.getAttribute('data-fixture1')).to.equal(null);
      expect(Q('#fixture').node.getAttribute('data-fixture2')).to.equal(null);
      expect(Q('#fixture').node.getAttribute('data-fixture3')).to.equal(null);
    });
    it('should get all data attributes', function () {
      Q('#fixture').data({
        id: 'id',
        id2: 'id2'
      });
      var r = Q('#fixture').data();

      r.should.eql({
        id: 'id',
        id2: 'id2'
      });
      Q('#fixture').data({
        id: null,
        id2: null
      });
    });
  });

  describe('Tree traversing', function () {
    beforeEach(function () {
      var ul = new Element(
        '<ul id="list" class="list">' +
        '<li id="li11"></li>' +
        '<li id="li12">' +
          '<ul id="sublist">' +
            '<li id="li21"></li>' +
            '<li id="li22" class="lisubsub"></li>' +
            '<li id="li23" class="li23 lisubsub"></li>' +
          '</ul>' +
        '</li>' +
       '</ul>');

      document.body.appendChild(ul.node);
    });

    afterEach(function () {
      Q('#list').remove();
    });

    describe('Element.parent and Element.parents', function () {
      it('should find the first parent', function () {
        Q('#li21').parent().node.id.should.equal('sublist');
        Q('#li21').parent(1).node.id.should.equal('sublist');
      });

      it('should find the grand parent', function () {
        Q('#li21').parent(2).node.id.should.equal('li12');
      });

      it('should find the grand grand parent', function () {
        Q('#li21').parent(3).node.id.should.equal('list');
      });

      it('should return a DocumentFragment', function () {
        Q('#li21').parent(20).node.nodeType.should.equal(11);;
      });

      it('should find the parent with class "list"', function () {
        Q('#li21').parents('.list').node.id.should.equal('list');
        Q('#li21').parent('.list').node.id.should.equal('list');
      });
    });

    describe('Element.child and Element.childs', function () {
      it('should find the first child', function () {
        Q('#list').child().node.id.should.equal('li11');
        Q('#list').child(1).node.id.should.equal('li11');
      });

      it('should find the second child', function () {
        Q('#list').child(2).node.id.should.equal('li12');
      });

      it('should return a DocumentFragment', function () {
        Q('#list').child(3).node.nodeType.should.equal(11);;
      });

      it('should find the child with class "li23"', function () {
        Q('#list').childs('.li23').node.id.should.equal('li23');
        Q('#list').child('.li23').node.id.should.equal('li23');
      });

      it('should find the childs with class "lisubsub"', function () {
        var r = Q('#list').child('.lisubsub');

        r.length.should.equal(2);
        r.elements[0].node.id.should.equal('li22');
        r.elements[1].node.id.should.equal('li23');
      });
    });

    describe('Element.previousSibling and Element.previousSiblings', function () {
      it('should find the previous sibling', function () {
        Q('#li23').previousSibling().node.id.should.equal('li22');
        Q('#li23').previousSibling(1).node.id.should.equal('li22');
      });

      it('should find the second previous sibling', function () {
        Q('#li23').previousSibling(2).node.id.should.equal('li21');
      });

      it('should return a DocumentFragment', function () {
        Q('#li23').previousSibling(3).node.nodeType.should.equal(11);;
      });

      it('should find the previous sibling with class "lisubsub"', function () {
        Q('#li23').previousSibling('.lisubsub').node.id.should.equal('li22');
        Q('#li23').previousSiblings('.lisubsub').node.id.should.equal('li22');
      });
    });

    describe('Element.nextSibling and Element.nextSiblings', function () {
      it('should find the next sibling', function () {
        Q('#li21').nextSibling().node.id.should.equal('li22');
        Q('#li21').nextSibling(1).node.id.should.equal('li22');
      });

      it('should find the second next sibling', function () {
        Q('#li21').nextSibling(2).node.id.should.equal('li23');
      });

      it('should return a DocumentFragment', function () {
        Q('#li21').nextSibling(3).node.nodeType.should.equal(11);;
      });

      it('should find the next sibling with class "lisubsub"', function () {
        Q('#li21').nextSibling('.lisubsub').node.id.should.equal('li22');
        Q('#li21').nextSiblings('.lisubsub').node.id.should.equal('li22');
      });
    });
  });

  describe('DOM manipulations', function () {
    describe('Append', function () {
      it('should append tag to existing dom element', function () {
        Q('#fixture').append('span');
        Q('#fixture').child().node.nodeName.should.equal('SPAN');
        Q('#fixture').empty();
      });
      it('should append string as node to existing dom element', function () {
        Q('#fixture').append('<span id="span"></span>');
        Q('#fixture').child().node.id.should.equal('span');
        Q('#fixture').empty();
      });
      it('should append node to existing dom element', function () {
        Q('#fixture').append(document.createElement('span'));
        Q('#fixture').child().node.nodeName.should.equal('SPAN');
        Q('#fixture').empty();
      });
      it('should append element to existing dom element', function () {
        Q('#fixture').append(new Element('span'));
        Q('#fixture').child().node.nodeName.should.equal('SPAN');
        Q('#fixture').empty();
      });
      it('should append tag to documentFragment', function () {
        var f = new Element();

        f.append('span');
        f.child().node.nodeName.should.equal('SPAN');
      });
    });

    describe('Prepend', function () {
      it('should prepend tag to existing dom element', function () {
        Q('#fixture').prepend('span');
        Q('#fixture').child().node.nodeName.should.equal('SPAN');
        Q('#fixture').empty();
      });

      it('should prepend tag to existing dom element', function () {
        Q('#fixture').append('div');
        Q('#fixture').prepend('span');
        Q('#fixture').child().node.nodeName.should.equal('SPAN');
        Q('#fixture').empty();
      });
    });

    describe('Before', function () {
      it('should insert before', function () {
        Q('#fixture').prepend('span');
        Q('#fixture').child().before('div');
        Q('#fixture').child().node.nodeName.should.equal('DIV');
        Q('#fixture').empty();
      });
    });

    describe('After', function () {
      it('should insert after', function () {
        Q('#fixture').append('span');
        Q('#fixture').child().after('div');
        Q('#fixture').child().node.nodeName.should.equal('SPAN');
        Q('#fixture').child(2).node.nodeName.should.equal('DIV');
        Q('#fixture').empty();
      });
    });

    describe('Wrap', function () {
      it('should wrap element and return wrapped element', function () {
        Q('#fixture').append('span');
        var test = Q('#fixture').child().wrap('div');

        Q('#fixture').child().node.nodeName.should.equal('DIV');
        Q('#fixture').child().child().node.nodeName.should.equal('SPAN');
        test.node.nodeName.should.equal('SPAN');
        Q('#fixture').empty();
      });

      it('should wrap element and return wrapping element', function () {
        Q('#fixture').append('span');
        var test = Q('#fixture').child().wrap('div', false);

        Q('#fixture').child().node.nodeName.should.equal('DIV');
        Q('#fixture').child().child().node.nodeName.should.equal('SPAN');
        test.node.nodeName.should.equal('DIV');
        Q('#fixture').empty();
      });
    });

    describe('Unwrap', function () {
      it('should unwrap element', function () {
        Q('#fixture').append('span');
        var span = Q('#fixture').child();

        Q('#fixture').child().wrap('div');
        span.unwrap();
        Q('#fixture').child().node.nodeName.should.equal('SPAN');
        Q('#fixture').empty();
      });
    });

    describe('Empty', function () {
      it('shoud empty element text node', function () {
        Q('#fixture').html('test');
        Q('#fixture').node.innerHTML.should.equal('test');
        Q('#fixture').empty();
        Q('#fixture').node.innerHTML.should.equal('');
      });

      it('shoud empty element nodes', function () {
        Q('#fixture').append('div');
        Q('#fixture').append('div');
        Q('#fixture').append('div');
        Q('#fixture').childs('div').length.should.equal(3);
        Q('#fixture').empty();
        Q('#fixture').node.innerHTML.should.equal('');
      });
    });

    describe('Remove', function () {
      it('should remove element from DOM', function () {
        Q('#fixture').after('div');
        var div = Q('#fixture').nextSibling();

        div.isInDom.should.equal(true);
        div.remove();
        div.isInDom.should.equal(false);
      });
    });
  });

  describe('Content, cloning and informations', function () {
    describe('html', function () {
      it('should get the html content', function () {
        Q('#fixture').html().should.equal('fixture');
      });
      it('should set the html content', function () {
        Q('#fixture').after('div');
        var div = Q('#fixture').nextSibling();

        div.html('test');
        div.node.innerHTML.should.equal('test');
        div.remove();
      });
    });

    describe('outerHTML', function () {
      it('should get the outerHTML content', function () {
        Q('#fixture').outerHTML.should.equal('<div class="fixture" id="fixture">fixture</div>');
      });
    });

    describe('clone', function () {
      it('should create a clone', function () {
        Q('#fixture').empty().append('div');
        Q('#fixture').child().append('<div class="1"></div><div class="2"></div>');
        var clone = Q('#fixture').child().clone();

        Q('#fixture').append(clone);
        Q('#fixture').child(1).html().should.equal(Q('#fixture').child(2).html());
        clone.child().removeClass('1');
        Q('#fixture').child(1).html().should.not.equal(Q('#fixture').child(2).html());
      });
    });

    describe('shallow', function () {
      it('should create a shallow copy', function () {
        Q('#fixture').empty().append('div');
        Q('#fixture').child().append('<div class="1"></div><div class="2"></div>');
        var clone = Q('#fixture').child().shallow();

        Q('#fixture').append(clone);
        Q('#fixture').child(2).html().should.equal('');
      });
    });

    describe('isInDom', function () {
      it('should be true if is in dom', function () {
        var div = new Element('div');

        div.isInDom.should.equal(false);
        Q('#fixture').append(div);
        div.isInDom.should.equal(true);
        Q('#fixture').empty();
      });
    });

    describe('root', function () {
      it('should return the root object container of the element', function () {
        var div = new Element('div');

        should.equal(div.root, null);
        var df = new Element();

        df.append(div);
        div.root.toString().should.equal('[object DocumentFragment]');
        Q('#fixture').append(df);
        div.root.should.equal(document);
        Q('#fixture').empty();
      });
    });
  });

  describe('Fade in and out', function () {
    before(function () {
      var e = new Element('div', {
        id: 'fixture-fade',
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '50px',
          height: '50px',
          'background-color': '#000'
        }
      });

      document.body.appendChild(e.node);
    });

    after(function () {
      Q('#fixture-fade').remove();
    });

    it('should fade out in 400ms', function (done) {
      Q('#fixture-fade').fadeOut()
        .then(function (el) {
          expect(el.node.style.opacity).to.equal('0');
          done();
        });
    });
    it('should fade in in 400ms', function (done) {
      Q('#fixture-fade').fadeIn()
        .then(function (el) { expect(el.node.style.opacity).to.equal('1'); })
        .then(done);
    });
    it('should fade out in 1500ms', function (done) {
      this.timeout(5000);
      Q('#fixture-fade').fadeOut({duration: 1500})
        .then(function (el) { expect(el.node.style.opacity).to.equal('0'); })
        .then(done);
    });
    it('should fade in in 1500ms', function (done) {
      Q('#fixture-fade').fadeIn({duration: 1500})
        .then(function (el) { expect(el.node.style.opacity).to.equal('1'); })
        .then(done);
    });
    it('should run callback', function (done) {
      Q('#fixture-fade').fadeOut({}, function (el) {
        el.node.style.backgroundColor = '#060';
      })
        .then(function (el) {
          expect(el.node.style.backgroundColor).to.equal('rgb(0, 102, 0)');
        })
        .then(done);
    });
    it('should fade in in 400ms', function (done) {
      Q('#fixture-fade').fadeIn()
        .then(function (el) { expect(el.node.style.opacity).to.equal('1'); })
        .then(done);
    });
  });
});
