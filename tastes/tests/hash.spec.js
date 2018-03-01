import hash from 'utilities/hash';

describe('Hash utility function', function () {
  it('should return 0 if no text as input', function () {
    hash().should.equal(0);
    hash('').should.equal(0);
  });

  it('should return hashed string', function () {
    hash('a').should.equal('khj');
  });
});
