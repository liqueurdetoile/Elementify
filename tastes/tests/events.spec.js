import {ready, complete} from 'index';

/**
*  @test {ready}
*/
describe('Ready', function () {
  it('Should run callback at interactive ready state', function (done) {
    let spy = sinon.spy();

    ready().then(spy).then(() => {
      spy.called.should.be.true;
      done();
    });
    spy.called.should.be.false;
  });
});

/**
*  @test {complete}
*/
describe('Complete', function () {
  it('Should run callback at complete ready state', function (done) {
    let spy = sinon.spy();

    complete().then(spy).then(() => {
      spy.called.should.be.true;
      done();
    });
    spy.called.should.be.false;
  });
});
