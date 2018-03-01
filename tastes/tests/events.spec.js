import {ready, complete} from 'index';

/**
*  @test {ready}
*/
describe('Ready', function () {
  it('Should run callback at interactive ready state', function (done) {
    let spy = sinon.spy();

    ready(() => spy());
    ready(() => {
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

    complete(() => spy());
    complete(() => {
      spy.called.should.be.true;
      done();
    });
    spy.called.should.be.false;
  });
});
