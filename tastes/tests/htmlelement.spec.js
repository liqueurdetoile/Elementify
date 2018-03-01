import {Element} from 'index';
import {Q} from 'index';

describe('HTMLElement Class', function () {
  window.beforeEach(function () { // eslint-disable-line
    let e = new Element('div', {
      class: 'fixture',
      id: 'fixture',
      innerHTML: 'fixture'
    });

    document.body.appendChild(e.node);
  });

  window.afterEach(function () { // eslint-disable-line
    Q('#fixture').remove();
  });

  describe('Constructor', function () {
    it('should add attributes', function () {
      let stringdiv = new Element('div', {
        class: 'class1',
        style: 'text-align:left; display:none'
      });
      let arraydiv = new Element('div', {
        class: ['class1', 'class2'],
        style: {
          display: 'none',
          padding: '20px',
          marginLeft: '10em'
        }
      });

      stringdiv.node.className.should.equal('class1');
      stringdiv.style('text-align').should.equal('left');
      stringdiv.style('display').should.equal('none');
      arraydiv.node.className.should.equal('class1 class2');
      arraydiv.style(['display', 'padding', 'marginLeft']).should.eql({
        display: 'none',
        padding: '20px',
        marginLeft: '10em'
      });
      arraydiv.style('display').should.equal('none');
      arraydiv.style('padding').should.equal('20px');
      arraydiv.style('margin-left').should.equal('10em');
    });
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
      let r = Q('#fixture').attr(['fixture1', 'fixture2', 'fixture3']);

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
      let r = Q('#fixture').attr();

      r.should.eql({
        class: 'fixture',
        id: 'fixture'
      });
    });

    it('should set a single data attribute', function () {
      Q('#fixture').data('fixture', 'fixture');
      Q('#fixture').node.getAttribute('data-fixture').should.equal('fixture');
    });
    it('should get a single data attribute', function () {
      Q('#fixture').data('fixture', 'fixture');
      Q('#fixture').data('fixture').should.equal('fixture');
      expect(Q('#fixture').data('foo')).to.be.undefined;
    });
    it('should remove a single data attribute', function () {
      Q('#fixture').data('fixture', null);
      expect(Q('#fixture').node.getAttribute('data-fixture')).to.equal(null);
    });
    it('should set multiple data attributes', function () {
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
      let r = Q('#fixture').data(['fixture1', 'fixture2', 'fixture3']);

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
      let r = Q('#fixture').data();

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
    window.beforeEach(function () { // eslint-disable-line
      let ul = new Element(
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

    window.afterEach(function () { // eslint-disable-line
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

      it('should return document', function () {
        Q('#li21').parent(20).node.nodeType.should.equal(9);;
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
        let r = Q('#list').child('.lisubsub');

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
        let f = new Element();

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
        let test = Q('#fixture').child().wrap('div');

        Q('#fixture').child().node.nodeName.should.equal('DIV');
        Q('#fixture').child().child().node.nodeName.should.equal('SPAN');
        test.node.nodeName.should.equal('SPAN');
        Q('#fixture').empty();
      });

      it('should wrap element and return wrapping element', function () {
        Q('#fixture').append('span');
        let test = Q('#fixture').child().wrap('div', false);

        Q('#fixture').child().node.nodeName.should.equal('DIV');
        Q('#fixture').child().child().node.nodeName.should.equal('SPAN');
        test.node.nodeName.should.equal('DIV');
        Q('#fixture').empty();
      });
    });

    describe('Unwrap', function () {
      it('should unwrap element', function () {
        Q('#fixture').append('span');
        let span = Q('#fixture').child();

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
        let div = Q('#fixture').nextSibling();

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
        let div = Q('#fixture').nextSibling();

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

        let clone = Q('#fixture').child().clone();

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
        let clone = Q('#fixture').child().shallow();

        Q('#fixture').append(clone);
        Q('#fixture').child(2).html().should.equal('');
      });
    });

    describe('isInDom', function () {
      it('should be true if is in dom', function () {
        let div = new Element('div');

        div.isInDom.should.equal(false);
        Q('#fixture').append(div);
        div.isInDom.should.equal(true);
        Q('#fixture').empty();
      });
    });

    describe('root', function () {
      it('should return the root object container of the element', function () {
        let div = new Element('div');

        expect(div.root).to.equal(div.node);
        document.body.appendChild(div.node);
        expect(div.root).to.equal(document);
        div.remove();
      });
    });
  });

  describe('Styles and display functions', function () {
    describe('Styles', function () {
      it('should return node style properties', function () {
        Q('#fixture').styles.should.eql(getComputedStyle(document.getElementById('fixture')));
      });
    });
    describe('Style', function () {
      it('should return the initial style properties values', function () {
        let div = Q('+div', {
          style: {
            color: 'red',
            margin: '1em'
          }
        });

        expect(div.style()).to.eql({color: 'red', margin: '1em'});
        expect(div.style('color')).to.equal('red');
        expect(div.style('unknown')).to.equal(undefined);
        expect(div.style(['color', 'margin'])).to.eql({color: 'red', margin: '1em'});
      });

      it('should set style properties', function () {
        let div = Q('+div');

        div.style('background-color', 'red');
        div.node.style.backgroundColor.should.equal('red');
        div.style({backgroundColor: 'yellow', margin: '1em'});
        div.node.style.backgroundColor.should.equal('yellow');
        div.node.style.margin.should.equal('1em');
        div.style({align: 'left'}, true).style().should.eql({align: 'left'});
        expect(div.style(56)).to.equal(undefined);
      });
    });
    describe('Visible, display, hide, show, toggle', function () {
      it('should return false for an element not in DOM', function () {
        let div = Q('+div');

        expect(div.visible).to.equal(false);
      });
      it('should return true/false for an element in DOM', function () {
        let div = Q('+div', {id: 'visible-fixture'});

        document.body.appendChild(div.node);
        expect(div.visible).to.equal(true);
        div.display('none');
        expect(div.visible).to.equal(false);
        div.show();
        expect(div.visible).to.equal(true);
        div.hide();
        expect(div.visible).to.equal(false);
        div.toggle();
        expect(div.visible).to.equal(true);
        div.toggle();
        expect(div.visible).to.equal(false);
        div.remove();
      });
    });
    describe('Classes', function () {
      it('should check class', function () {
        let div = Q('+div', {class: 'one two'});

        div.hasClass('one').should.equal(true);
        div.hasClass('one two').should.equal(false);
        div.hasClass('one', 'two').should.equal(true);
        div.hasClass('three').should.equal(false);
        div.hasClass('one three').should.equal(false);
        div.hasClass('one', 'three').should.equal(false);
        div.hasClass('one', 'two', 'three').should.equal(false);
      });

      it('should add class', function () {
        let div = Q('+div');

        div.addClass('one').hasClass('one').should.equal(true);
        div.addClass('one', 'two').hasClass('one', 'two').should.equal(true);
      });

      it('should remove class', function () {
        let div = Q('+div', { class: ['one', 'two', 'three']});

        div.removeClass('one').hasClass('one').should.equal(false);
        div.removeClass('four').should.eql(div);
        div.removeClass('three', 'two').node.className.should.equal('');
      });

      it('should toggle class', function () {
        let div = Q('+div');

        div.toggleClass('one').hasClass('one').should.equal(true);
        div.toggleClass('one').hasClass('one').should.equal(false);
        div.toggleClass('one', 'two').hasClass('one', 'two').should.equal(true);
        div.toggleClass('one', 'two').hasClass('one', 'two').should.equal(false);
        div.toggleClass('one', 'two').hasClass('one', 'two').should.equal(true);
        div.toggleClass('one').hasClass('two').should.equal(true);
        div.toggleClass('one').hasClass('one', 'two').should.equal(true);
      });
    });
  });

  describe('NodeMetrics', function () {
    describe('Position', function () {
      it('should return NodeMetrics object', function () {
        let i = Q('+div', {
          id: 'pFixture',
          style: {
            position: 'absolute',
            top: '50px',
            left: '50px',
            width: '100px',
            height: '100px',
            border: '1px solid #000'
          }
        });

        expect(i.position).to.be.an('object')
          .to.have.all.keys('left', 'right', 'width', 'height', 'top', 'bottom', 'scrollX', 'scrollY');
        i.position.should.eql({
          left: undefined,
          right: undefined,
          width: undefined,
          top: undefined,
          bottom: undefined,
          height: undefined,
          scrollX: undefined,
          scrollY: undefined
        });
        Q('=body').append(i);
        i.position.should.contain({
          left: 50,
          top: 50,
          width: 100,
          height: 100
        });
      });

      it('should set object position', function () {
        Q('#pFixture').left = null;
        Q('#pFixture').right = 50;
        Q('#pFixture').position.should.contain({
          right: 50,
          top: 50,
          width: 100,
          height: 100
        });
      });
    });
  });

  describe('Events', function () {
    describe('Update events manager', function () {
      var i, spy1, spy2, spy3;

      window.beforeEach(function () {
        i = Q('+div');
        spy1 = () => {this.name = 'spy1';};
        spy2 = () => {this.name = 'spy2';};
        spy3 = () => {this.name = 'spy3';};

        Q('body').append(i);
        i.on('click', spy1);
        i.on('click', spy2);
        i.on('mouseover', spy3);
      });

      window.afterEach(function () {
        i.remove();
      });

      it('should remove all listeners when element removed from DOM', function () {
        i.remove();
        i.hasEvent().should.be.false;
      });

      it('should remove all listeners when calling off()', function () {
        i.off();
        i.hasEvent().should.be.false;
      });

      it('should remove all clicks events when calling off(\'click\')', function () {
        i.off('click');
        i.hasEvent('click').should.be.false;
        i.hasEvent('mouseover').should.be.true;
      });

      it('should remove only one click event when calling off(\'click\', spy1)', function () {
        i.off('click', spy1);
        i.hasEvent('click', spy1).should.be.false;
        i.hasEvent('click', spy2).should.be.true;
        i.hasEvent('mouseover').should.be.true;
      });
    });

    describe('Native events - Single Element', function () {
      var i, spy1, spy2, spy3, f1, f2, f3;

      window.beforeEach(function () {
        i = Q('+div');
        spy1 = sinon.spy();
        spy2 = sinon.spy();
        spy3 = sinon.spy();
        f1 = function () { spy1(); };
        f2 = function () { spy2(); };
        f3 = function () { spy3(); };

        Q('body').append(i);
      });

      window.afterEach(function () {
        i.remove();
      });

      it('Should add single listener on single HtmlElement and fire it', function () {
        i.on('click', spy1);
        i.fire('click');
        spy1.called.should.be.true;
        expect(spy1.args[0][0]).to.be.instanceof(Event);
        expect(spy1.args[0][0].eventName).to.equal('click');
        expect(spy1.args[0][0].target).to.equal(i.node);
      });

      it('Should add multiple listeners (same event) on single HtmlElement and fire it', function () {
        i.on('click', f1);
        i.on('click', f2);
        i.fire('click');
        spy1.called.should.be.true;
        spy2.called.should.be.true;
      });

      it('Should add multiple listeners (multiple events) on single HtmlElement and fire it', function () {
        i.on('click', f1);
        i.on('click', f2);
        i.on('mouseover', f3);
        i.fire('click');
        spy1.called.should.be.true;
        spy2.called.should.be.true;
        spy3.called.should.be.false;
        i.fire('mouseover');
        spy1.calledTwice.should.be.false;
        spy2.calledTwice.should.be.false;
        spy3.called.should.be.true;
      });

      it('Should remove single listener on single HtmlElement (specific call)', function () {
        i.on('click', spy1);
        i.off('click', spy1);
        i.fire('click');
        spy1.called.should.be.false;
      });

      it('Should remove single listener on single HtmlElement (event call)', function () {
        i.on('click', spy1);
        i.off('click');
        i.fire('click');
        spy1.called.should.be.false;
      });

      it('Should remove single listener on single HtmlElement (all events call)', function () {
        i.on('click', spy1);
        i.off();
        i.fire('click');
        spy1.called.should.be.false;
      });

      it('Should remove one among multiple listener (same event) on single HtmlElement and fire it', function () {
        i.on('click', f1);
        i.on('click', f2);
        i.on('mouseover', f3);

        i.off('click', f1);
        i.fire('click');
        spy1.called.should.be.false;
        spy2.called.should.be.true;
        spy3.called.should.be.false;
      });

      it('Should remove all for event multiple listener (same event) on single HtmlElement and fire it', function () {
        i.on('click', f1);
        i.on('click', f2);
        i.on('mouseover', f3);

        i.off('click');
        i.fire('click');
        spy1.called.should.be.false;
        spy2.called.should.be.false;
        spy3.called.should.be.false;
      });

      it('Should remove all multiple listener (same event) on single HtmlElement and fire it', function () {
        i.on('click', f1);
        i.on('click', f2);
        i.on('mouseover', f3);
        i.off();
        i.fire('click');
        i.fire('mouseover');
        spy1.called.should.be.false;
        spy2.called.should.be.false;
        spy3.called.should.be.false;
      });
    });

    describe('Native events - Others tests', function () {
      it('Should add listener on Collection', function () {
        let i = new Element('<div id="d1"></div><div id="d2"></div>');
        let spy = sinon.spy();

        Q('body').append(i);
        i.on('click', spy);
        i.fire('click');
        spy.calledTwice.should.be.true;
      });

      it('Should remove listener on Collection', function () {
        let i = new Element('<div id="d1"></div><div id="d2"></div>');
        let spy = sinon.spy();

        Q('body').append(i);
        i.on('click', spy);
        i.off();
        i.fire('click');
        spy.called.should.be.false;
      });

      it('Should add listener at construct on single HtmlElement', function () {
        let spy = sinon.spy();
        let i = Q('+div', {
          events: {
            click: spy
          }
        });

        Q('body').append(i);
        i.on('click', spy);
        i.fire('click');
        spy.called.should.be.true;
      });

      it('Should add listener at construct on Collection', function () {
        let spy = sinon.spy();
        let i = new Element('<div id="d1"></div><div id="d2"></div>', {
          events: {
            click: spy
          }
        });

        Q('body').append(i);
        i.on('click', spy);
        i.fire('click');
        spy.calledTwice.should.be.true;
      });

      it('Should fire event on window', function () {
        let spy1 = sinon.spy();
        let spy2 = sinon.spy();
        let i = Q('+div');

        window.addEventListener('click', spy1);
        i.on('click', spy2);
        i.fire('click', window);
        spy1.called.should.be.true;
        spy2.called.should.be.false;
      });

      it('Should fire event on another element', function () {
        let spy1 = sinon.spy();
        let spy2 = sinon.spy();
        let i = Q('+div');
        let j = Q('+div');

        Q('body').append(i).append(j);
        j.on('click', spy1);
        i.on('click', spy2);
        i.fire('click', j);
        spy1.called.should.be.true;
        spy2.called.should.be.false;
      });

      it('Should check registered events/event/callback', function () {
        let i = Q('+div');

        i.on('click', function f1() {});
        i.hasEvent().should.be.false; // Not in DOM

        Q(document.body).append(i);
        i.on('click', function f1() {});
        i.on('click', function f2() {});
        i.on('mouseover', function f1() {});

        i.hasEvent().should.be.true;
        i.hasEvent('click').should.be.true;
        i.hasEvent('mouseout').should.be.false;
        i.hasEvent('click', function f1() {}).should.be.true;
        i.hasEvent('click', function f3() {}).should.be.false;
      });

      it('Should fetch registered events/event/callback', function () {
        let i = Q('+div');
        let f1 = () => {};
        let f2 = () => {};

        i.on('click', function f1() {});
        i.hasEvent().should.be.false; // Not in DOM

        Q(document.body).append(i);
        i.on('click', f1);
        i.on('click', f2);
        i.on('mouseover', function f1() {});

        i.getEvent().should.have.all.keys('click', 'mouseover');
        i.getEvent('click').should.have.all.keys(i._callbackId(f1), i._callbackId(f2));
      });
    });
  });

  describe('Fade in and out', function () {
    before(function () {
      let e = new Element('div', {
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

    after(function () { //eslint-disable-line
      Q('#fixture-fade').remove();
    });

    it('should return a Promise if available or this (fadeOut)', function () {
      let p = Q('#fixture-fade').fadeOut();

      if (typeof Promise !== 'undefined') expect(p).to.be.instanceof(Promise);
      else expect(p).to.eql(Q('#fixture-fade'));
    });

    it('should return a Promise if available or this (fadeIn)', function () {
      let p = Q('#fixture-fade').fadeIn();

      if (typeof Promise !== 'undefined') expect(p).to.be.instanceof(Promise);
      else expect(p).to.eql(Q('#fixture-fade'));
    });

    it('should fade out in 400ms', function (done) {
      Q('#fixture-fade').fadeOut({}, el => {
        expect(el.node.style.opacity).to.equal('0');
        done();
      });
    });
    it('should fade in in 400ms', function (done) {
      Q('#fixture-fade').fadeIn({}, el => {
        expect(el.node.style.opacity).to.equal('1');
        done();
      });
    });
    it('should fade out in 1000ms', function (done) {
      Q('#fixture-fade').fadeOut({duration: 1000}, el => {
        expect(el.node.style.opacity).to.equal('0');
        done();
      });
    });
    it('should fade in in 1000ms', function (done) {
      Q('#fixture-fade').fadeIn({duration: 1000}, el => {
        expect(el.node.style.opacity).to.equal('1');
        done();
      });
    });
  });
});
