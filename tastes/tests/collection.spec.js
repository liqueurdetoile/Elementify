import {Q, Collection} from 'index';

describe.only('Collection class', function () {
  describe('constructor', function () {
    it('should return an empty collection', function () {
      let i = new Collection();

      i.should.be.instanceof(Collection);
      i.length.should.equal(0);
    });
  });
  describe('push', function () {
    it('should push an HtmlElement', function () {
      let i = new Collection();
      let e = Q('+div');

      i.push(e);
      i.length.should.equal(1);
      i.elements[0].should.equal(e);
    });

    it('should push a node', function () {
      let i = new Collection();
      let e = document.createElement('div');

      i.push(e);
      i.length.should.equal(1);
      i.elements[0].should.eql(Q(e));
    });

    it('should throw an exception', function () {
      let i = new Collection();
      let e = 'foo';

      i.push(e);
      console.log(i);
      // expect(i.push.bind(i, e)).to.throw('Only Element Object can be added to a collection of Elements');
    });
  });
});
