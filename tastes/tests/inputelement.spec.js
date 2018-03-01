import {Q} from 'index';
import ObjectArray from 'dot-object-array';

window.Q = Q;

/**
*  @test {InputElement}
*/

describe('InputElement', function () {
  /**
  *  @test {InputElement#constructor}
  */
  describe('Constructor', function () {
    it('should create input text with value', function () {
      let i = Q('+input', {type: 'text', value: 'fixture'});

      i.node.nodeName.should.equal('INPUT');
      i.type.should.equal('text');
      i.value.should.equal('fixture');
    });

    it('should create input text with required', function () {
      let i = Q('+input', {type: 'text', required: 'required'});

      i.rules.required.should.not.equal('undefined');
      i.validate().should.be.false;
      i.value = 'fixture';
      i.validate().should.be.true;
    });
  });

  /**
  *  @test {InputElement}.name
  */
  it('should return name attribute as name', function () {
    let i = Q('+input', {name: 'fixture', id: 'fixture2'});

    i.name.should.equal('fixture');
  });

  it('should return id attribute as name', function () {
    let i = Q('+input', {id: 'fixture2'});

    i.name.should.equal('fixture2');
  });

  it('should return randomized uniqid name', function () {
    let i = Q('+input');

    i.name.length.should.not.equal(0);
  });

  /**
  *  @test {InputElement.type}
  *  @test {InputElement#val}
  */
  describe('Type and values', function () {
    let i;

    window.beforeEach(function () {
      i = Q('+input');
    });

    describe('Textual input', function () {
      it('should set type, set and retrieve value', function () {
        i.type = 'email';
        i.attr('type').should.equal('email');
        i.val('fixture@fixture.com');
        i.val().should.equal('fixture@fixture.com');
      });
    });

    describe('Boolean inputs', function () {
      it('should set type, set and retrieve value', function () {
        i.type = 'checkbox';
        i.attr('type').should.equal('checkbox');

        i.val().should.be.false;
        i.node.checked = true;
        i.val().should.be.true;
        i.node.checked = false;
        i.val('test');
        expect(i.val()).to.be.undefined;
        i.node.checked = true;
        i.val().should.equal('test');
      });
    });

    describe('Select input', function () {
      it('should set type, set and retrieve value', function () {
        i = Q('+select', {
          options: {
            f1: 'fixture1',
            f2: 'fixture2'
          }
        });

        i.type.should.equal('select');
        i.value.should.equal('f1');

        i = Q('+select', {
          value: 'f2',
          options: {
            f1: 'fixture1',
            f2: 'fixture2'
          }
        });
        i.value.should.equal('f2');

        i = Q('+select', {
          value: 'f3',
          options: {
            f1: 'fixture1',
            f2: 'fixture2'
          }
        });
        i.value.should.equal('f1');
      });
    });

    describe('Textarea input', function () {
      it('should set type, set and retrieve value', function () {
        i = Q('+textarea');
        i.attr('type').should.equal('textarea');
        Q('body').append(i);

        i.val().should.equal('');
        i.val('fixture');
        i.val().should.equal('fixture');
        i.val('fixture2');
        i.val().should.equal('fixture2');

        i.remove();
      });
    });
  });

  /**
  *  @test {InputElement#rule}
  *  @test {InputElement.value}
  *  @test {InputElement#validate}
  */
  describe('Rule', function () {
    let i;
    const sameas = Q('+input', {name: 'sameas', type: 'text', value: 'fixture'});
    const rules = new ObjectArray({
      required: [
        {val: 'fixture', res: true},
        {val: '', res: false},
        {val: 0, res: true}
      ],
      int: [
        {val: 10, res: true},
        {val: -5, res: true},
        {val: 0, res: true},
        {val: '', res: false},
        {val: 'a', res: false},
        {val: '1a', res: false}
      ],
      number: [
        {val: 10, res: true},
        {val: -5, res: true},
        {val: 0, res: true},
        {val: 10.5, res: true},
        {val: -10.5, res: true},
        {val: '', res: false},
        {val: 'a', res: false},
        {val: 'a.10', res: false}
      ],
      email: [
        {val: 'fixture@fixture.com', res: true},
        {val: '', res: false},
        {val: 0, res: false},
        {val: 'fixture@', res: false},
        {val: '@fixture.com', res: false},
        {val: 'fixture@fixture', res: false}
      ]
    });

    window.beforeEach(function () {
      i = Q('+input');
    });

    it('should apply rule: sameas with empty value', function () {
      Q('body').append(sameas);
      i.rule('sameas', '@sameas');
      i.validate().should.equal(false);
      sameas.remove();
    });

    it('should apply rule: sameas with same values', function () {
      Q('body').append(sameas);
      i.rule('sameas', '@sameas');
      i.value = 'fixture';
      i.validate().should.equal(true);
      sameas.remove();
    });

    it('should apply rule: sameas with different values', function () {
      Q('body').append(sameas);
      i.rule('sameas', '@sameas');
      i.value = 'fixture3';
      i.validate().should.equal(false);
      sameas.remove();
    });

    rules.forEach(function (cases, rule) {
      cases.forEach(function (c) {
        it('should apply rule : ' + rule + ' with case : ' + JSON.stringify(c), function () {
          i.rule(rule);
          i.value = c.val;
          i.validate().should.equal(c.res);
        });
      });
    });

    it('should apply custom rule', function () {
      i.rule('custom', /fix/);
      i.validate().should.be.false;
      i.value = 'fixture';
      i.validate().should.be.true;
    });

    it('should not evaluate string as rule', function () {
      expect(i.rule.bind(i, 'pattern', 'notARegexp'))
        .to.not.throw('Custom rule value must be a regular expression or callback');
      i.rules.should.be.empty;
    });

    it('should evaluate string as rule', function () {
      expect(i.rule.bind(i, 'pattern', 'notARegexp', null, true))
        .to.not.throw('Custom rule value must be a regular expression or callback');
      i.rules.should.not.be.empty;
    });

    it('should apply callback', function () {
      var i = Q('+<input type="text">');

      i.rule('myRule', function () {
        return this.value > 5;
      }, 'value must be over 5');

      i.value = 3;
      i.validate().should.be.false;
      i.errors.should.eql({
        myRule: 'value must be over 5'
      });
      i.value = 6;
      i.validate().should.be.true;
    });
  });

  /**
  *  @test {InputElement#rules}
  *  @test {InputElement#errors}
  */
  describe('Rules', function () {
    it('should apply rules', function () {
      let i = Q('+input', {
        required: 'required'
      });

      i.rule('fixture', /1/, 'this must be a one');
      i.rules.should.not.be.empty;
      i.validate();
      i.errors.should.eql({
        required: 'FIELD_REQUIRED',
        fixture: 'this must be a one'
      });
      i.value = 'a';
      i.val('a');
      i.validate();
      i.errors.should.eql({
        fixture: 'this must be a one'
      });
      i.value = 1;
      i.validate();
      i.errors.should.be.empty;
    });
  });

  /**
  *  @test {label}
  */
  describe('Label method', function () {
    it('should output a label', function () {
      let i = Q('+input', {
        name: 'fixture'
      });

      i.label('label').outerHTML.should.equal('<label for="fixture">label</label>');
    });
  });

  /**
  *  @test {tooltip}
  */
  describe('Tooltip method', function () {
    it('should output a tooltip', function () {
      let i = Q('+input', {
        name: 'fixture'
      });

      i.tooltip('tooltip').outerHTML.should.equal('<span data-for="fixture" data-type="tooltip">tooltip</span>');
    });
  });
});
