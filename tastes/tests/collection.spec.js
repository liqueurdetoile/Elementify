import {Q, Collection} from 'index';

/**
*  @test {Collection}
*/
describe('Collection class', function () {
  /**
  *  @test {Collection#constructor}
  */
  describe('constructor', function () {
    it('should return an empty collection', function () {
      let i = new Collection();

      i.should.be.instanceof(Collection);
      i.length.should.equal(0);
    });
  });

  /**
  *  @test {Collection#push}
  */
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

      expect(i.push.bind(i, e)).to.throw('Only Element Object can be added to a collection of Elements');
    });
  });
});
