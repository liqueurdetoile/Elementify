import {Q, Element} from 'index';
import ObjectArray from 'dot-object-array';

/**
*  @test {FormElement}
*/
describe('FormElement', function () {
  /**
  *  @test {FormElement#constructor}
  */
  describe('Constructor', function () {
    it('should return and empty FormElement', function () {
      let f = new Element('form');

      f.node.nodeName.should.equal('FORM');
      f.node.method.should.equal('get');
    });

    it('should return a FormElement with Element method attribute set to post', function () {
      let f = new Element('form', {method: 'post'});

      f.node.nodeName.should.equal('FORM');
      f.node.method.should.equal('post');
    });
  });

  /**
  *  @test {FormElement#field}
  *  @test {FormElement#fields}
  */
  describe('Fields access', function () {
    it('should find a field, even if the name is already used elsewhere', function () {
      let f = new Element('form');
      let fake = Q('+<input type="text" name="fixture1" value="fixtureFake">');

      f.append('<input type="text" name="fixture1" value="fixture1">');
      Q('body').append(f).append(fake);

      f.field('fixture1').length.should.equal(1);
      f.field('fixture1').value.should.equal('fixture1');

      f.remove();
      fake.remove();
    });

    it('should return a collection of fields of the form', function () {
      let f = new Element('form');
      let fake = Q('+<input type="text" name="fixture1" value="fixtureFake">');

      f.append('<input type="text" name="fixture1" value="fixture1">');
      f.append('<input type="text" name="fixture2" value="fixture2">');
      Q('body').append(f).append(fake);

      f.fields.length.should.equal(2);
      f.fields.elements[0].value.should.equal('fixture1');
      f.fields.elements[1].value.should.equal('fixture2');

      f.remove();
      fake.remove();
    });

    it('should return a collection of fields and ignore fields with class form-ignore', function () {
      let f = new Element('form');

      f.append('<input type="text" name="fixture1" value="fixture1">');
      f.append('<input type="text" name="fixture2" value="fixture2">');
      f.append('<input type="text" class="form-ignore" name="fixture3" value="fixture3">');
      Q('body').append(f);

      f.fields.length.should.equal(2);
      f.fields.elements[0].value.should.equal('fixture1');
      f.fields.elements[1].value.should.equal('fixture2');

      f.remove();
    });
  });

  /**
  *  @test {FormElement#dirty}
  */
  describe('Dirty', function () {
    it('should return false if no field changed', function () {
      let f = new Element('form');

      f.append('<input type="text" name="fixture1" value="fixture1">');
      f.dirty.should.be.false;
    });
    it('should return true if field changed', function () {
      let f = new Element('form');

      f.append('<input type="text" name="fixture1" value="fixture1">');
      f.field('fixture1').value = 'fixtureX';
      f.dirty.should.be.true;
    });
  });

  /**
  *  @test {FormElement#validate}
  *  @test {FormElement.errors}
  */
  describe('Validate', function () {
    it('should validate', function () {
      let f = new Element('form');
      let i = new Element('input', {required: 'required'});

      f.append(i);
      f.validate().should.be.false;
      i.hasClass('field-not-validate').should.be.true;
      i.hasClass('field-validate').should.be.false;
      f._errors.length().should.equal(1);
      i.value = 'a';
      f.validate().should.be.true;
      i.hasClass('field-not-validate').should.be.false;
      i.hasClass('field-validate').should.be.true;
    });
  });

  /**
  *  @test {FormElement.data}
  *  @test {FormElement.urlEncode}
  *  @test {FormElement.formUrlEncode}
  *  @test {FormElement.formData}
  *  @test {FormElement.json}
  */
  describe('Data export and import', function () {
    it('should export data to ObjectArray', function () {
      let f = new Element('form');

      f.append('<input type="text" name="f1" value="fixture1">');
      f.append('<input type="text" name="f2" value="fixture2">');
      f.datas.should.be.instanceof(ObjectArray);
      f.datas.data.should.eql({f1: 'fixture1', f2: 'fixture2'});
    });

    it('should export data to ObjectArray with dotted keys', function () {
      let f = new Element('form');

      f.append('<input type="text" name="fixture.f1" value="fixture1">');
      f.append('<input type="text" name="fixture.f2" value="fixture2">');
      f.datas.should.be.instanceof(ObjectArray);
      f.datas.data.should.eql({fixture: {f1: 'fixture1', f2: 'fixture2'}});
    });

    it('should export data to JSON', function () {
      let f = new Element('form');

      f.append('<input type="text" name="f1" value="fixture1">');
      f.append('<input type="text" name="f2" value="fixture2">');
      f.json.should.equal('{"f1":"fixture1","f2":"fixture2"}');
    });

    it('should export data to JSON with dotted keys', function () {
      let f = new Element('form');

      f.append('<input type="text" name="fixture.f1" value="fixture1">');
      f.append('<input type="text" name="fixture.f2" value="fixture2">');
      f.json.should.equal('{"fixture":{"f1":"fixture1","f2":"fixture2"}}');
    });

    it('should export data to urlEncode string', function () {
      let f = new Element('form');

      f.append('<input type="text" name="f1" value="fixture1">');
      f.append('<input type="text" name="f2" value="fixture2 space">');
      f.urlEncode.should.equal('f1=fixture1&f2=fixture2%20space');
    });

    it('should export data to formUrlEncode string', function () {
      let f = new Element('form');

      f.append('<input type="text" name="f1" value="fixture1">');
      f.append('<input type="text" name="f2" value="fixture2 space">');
      f.formUrlEncode.should.equal('f1=fixture1&f2=fixture2+space');
    });

    it('should import data into fields from JSON', function () {
      let js = '{"fixvoid": true, "f1":"fixture1", "f2":"fixture2"}';
      let f = new Element('form');

      f.append('<input type="text" name="f1">');
      f.append('<input type="text" name="f2">');
      f.append('<input type="text" name="f3">');
      f.json = js;
      f.field('f1').value.should.equal('fixture1');
      f.field('f2').value.should.equal('fixture2');
      f.field('f3').value.should.equal('');
    });

    it('should import dotted keys data into fields from JSON', function () {
      let js = '{"fixvoid": true,"fixture":{"f1":"fixture1","f2":"fixture2"}}';
      let f = new Element('form');

      f.append('<input type="text" name="fixture.f1">');
      f.append('<input type="text" name="fixture.f2">');
      f.append('<input type="text" name="fixture.f3">');
      f.json = js;
      f.field('fixture.f1').value.should.equal('fixture1');
      f.field('fixture.f2').value.should.equal('fixture2');
      f.field('fixture.f3').value.should.equal('');
    });

    it('should throw an exception while import data into fields from JSON', function () {
      let js = '"fixvoid": true,"fixture":{"f1":"fixture1","f2":"fixture2"}}';
      let f = new Element('form');

      expect((function test() { f.json = js; })).to.throw(TypeError);
    });
  });

  describe('Events management', function () {
    it('should prevent submitting', function () {
      let f = new Element('form');
      let spy = sinon.spy();

      f.on('submit', (ev) => {
        ev.preventDefault();
        spy();
      });

      Q('body').append(f);
      f.fire('submit');
      spy.called.should.be.true;
      f.remove();
    });
  });

  describe('Should find a form by id', function () {
    it('should find form', function () {
      let f = new Element('form', {
        id: 'form-login'
      });

      Q(document.body).append(f);
      Q('#form-login').should.eql(f);
      f.remove();
    });
  });
});
