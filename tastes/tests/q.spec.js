import {Q} from 'index';

describe('Q magic', function () {
  describe('Element creation', function () {
    it('should returns a void HtmlElement', function () {
      let e = Q();

      e.enhanced.should.equal(true);
      e.node.nodeType.should.equal(11);
    });

    it('should return element unchanged', function () {
      let e = Q('+div');
      let i = Q(e);

      e.should.eql(i);
    });

    it('should create an HtmlElement from a node', function () {
      let e = document.createElement('div');
      let i = Q(e);

      i.enhanced.should.equal(true);
      i.node.should.eql(e);
    });

    it('should create an HtmlElement from string', function () {
      let e = Q('+<ul style="display:none" id="list" class="list">' +
        '<li id="li11"></li>' +
        '<li id="li12">' +
          '<ul id="sublist">' +
            '<li id="li21"></li>' +
            '<li id="li22" class="lisubsub"></li>' +
            '<li id="li23" class="li23 lisubsub"></li>' +
          '</ul>' +
        '</li>' +
        '<li><form id="form"><input type="text"><input type="text" id="name" name="fixture"></form></li>' +
       '</ul>');

      e.enhanced.should.equal(true);
      e.node.nodeName.should.equal('UL');
      document.body.appendChild(e.node);
    });
  });

  describe('Element query', function () {
    it('should throw an exception if invalid query selector', function () {
      expect(Q.bind(Q, '*diva')).to.throw('Invalid CSS query Selector');
    });

    it('should find #li11 in DOM and memory', function () {
      let e = Q('#list');

      Q('#li11').node.id.should.equal('li11');
      e.remove();
      Q('#li11').length.should.equal(0);
      Q('#li11', e).node.id.should.equal('li11');
      document.body.appendChild(e.node);
    });

    it('should find .li23 in DOM and memory', function () {
      let e = Q('#list');

      Q('.li23').node.id.should.equal('li23');
      e.remove();
      Q('.li23').length.should.equal(0);
      Q('.li23', e).node.id.should.equal('li23');
      document.body.appendChild(e.node);
    });

    it('should find @fixture in DOM and memory', function () {
      let e = Q('#list');

      Q('@fixture').node.id.should.equal('name');
      e.remove();
      Q('@fixture').length.should.equal(0);
      Q('@fixture', e).node.id.should.equal('name');
      document.body.appendChild(e.node);
    });

    it('should find =form in DOM and memory', function () {
      let e = Q('#list');

      Q('=form').node.id.should.equal('form');
      e.remove();
      Q('=form').length.should.equal(0);
      Q('=form', e).node.id.should.equal('form');
      document.body.appendChild(e.node);
    });

    it('should find li.li23 in DOM and memory', function () {
      let e = Q('#list');

      Q('li.li23').node.id.should.equal('li23');
      e.remove();
      Q('li.li23').length.should.equal(0);
      Q('li.li23', e).node.id.should.equal('li23');
      document.body.appendChild(e.node);
    });
  });
});
