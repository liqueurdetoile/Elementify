import $ from 'elements/query';

describe('Q magic', function () {
  describe('element creation', function () {
    it('should returns a void HtmlElement', function () {
      let e = $();

      e.enhanced.should.equal(true);
      e.node.nodeType.should.equal(11);
    });

    it('should return element unchanged', function () {
      let e = $('+div');
      let i = $(e);

      e.should.eql(i);
    });

    it('should create an HtmlElement from a node', function () {
      let e = document.createElement('div');
      let i = $(e);

      i.enhanced.should.equal(true);
      i.node.should.eql(e);
    });

    it('should create an HtmlElement from string', function () {
      let e = $('+<ul id="list" class="list">' +
        '<li id="li11"></li>' +
        '<li id="li12">' +
          '<ul id="sublist">' +
            '<li id="li21"></li>' +
            '<li id="li22" class="lisubsub"></li>' +
            '<li id="li23" class="li23 lisubsub"></li>' +
          '</ul>' +
        '</li>' +
       '</ul>');

      e.enhanced.should.equal(true);
      e.node.nodeName.should.equal('UL');
    });

  });
});
