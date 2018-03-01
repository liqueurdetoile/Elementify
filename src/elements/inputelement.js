/**
*  @file Input Element definition class
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

import ObjectArray from 'dot-object-array';
import HtmlElement from 'elements/htmlelement';
import Q from 'query';
import uniqid from 'utilities/uniqid';

/**
*  InputElement is the common basic class wrapping all vanilla HTML inputs.
*  It provides all properties and method to :
*  - get/set Element value
*  - reset Element value
*  - validate Element value
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*/

export default class InputElement extends HtmlElement {
  /**
  *  InputElement constructor
  *  Node and options are passed through {@link Element} call.
  *
  *  If the Element have required or pattern atributes, validation
  *  rules will be automatically set accordingly.
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @private
  *
  *  @param {Element} node Input element
  *  @param {KeyValueObject} options Options for the InputElement
  *
  *  Specific keys are :
  *
  *  - `value`: initial value of the Element
  *  - `options`: list of options {value: text} for a select tag
  *
  *  @returns {InputElement}
  *  @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
  */
  constructor(node, options = {}) {
    options.type = options.type || 'text';

    super(node, options);

    /**
    *  Rules for validation
    *
    *  @type {ObjectArray}
    *  @since 1.0.0
    */
    this._rules = new ObjectArray();

    /**
    *  Errors after validation
    *
    *  @type {ObjectArray}
    *  @since 1.0.0
    */
    this._errors = new ObjectArray();

    // Add input type to Textarea and Select for further switch operations
    if (this.node.nodeName === 'TEXTAREA') this.type = 'textarea';
    if (this.node.nodeName === 'SELECT') {
      this.type = 'select';
      // Generates options items
      if (options.options) {
        for (let key in options.options) {
          this.append(`<option value="${key}" ${key === options.value ? 'selected' : ''}>` +
                      `${options.options[key]}` +
                      '</option>');
        }
      }
    }

    // Set value
    if (options.value !== undefined) {
      this.value = this.node.defaultValue = options.value;
    }

    // Set validation rules
    if (this.attr('required')) this.rule('required');
    if (this.attr('pattern')) this.rule('patternAttribute', this.attr('pattern'), null, true);
    this.rule(this.attr('type'));
  }

  /**
  *  Get a unique name
  *  - `name`attribute value
  *  - `id` attribute value if name not set
  *  - A random unique id if both name and value are not set
  *
  *  @type {string}
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get name() {
    let name = this.node.name || this.node.id;

    if (name === '') name = 'input-' + uniqid();
    return name;
  }

  /**
  *  Get standardized lowercased type attribute
  *
  *  @type {string}
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get type() {
    return (this.attr('type') || 'text').toLowerCase();
  }

  /**
  *  Set input type attribute
  *
  *  @type {string}
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  set type(t) {
    this.attr('type', t);
  }

  /**
  *  Get value
  *
  *  It normalizes the behaviour for boolean inputs (radio & checkbox) :
  *  - If no value attribute is set, it will return `true` or `false`
  *  - If a value attribute is set, it will return undefined and will be
  *  skipped in fields list if not checked or returns its value otherwise.
  *
  *  @type {boolean|string|undefined}
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @todo
  *  - Add more casting (all values are considered as string when extracted)
  */
  get value() {
    var ret;

    switch (this.type) {
      case 'checkbox' :
      case 'radio' :
        if (typeof this.attr('value') !== 'undefined' && this.attr('value') !== null) {
          ret = (this.node.checked ? this.attr('value') : undefined);
        } else ret = this.node.checked;
        break;
      default:
        ret = (this.node.value || '').trim();
        break;
    }
    return ret;
  }

  /**
  *  Set value
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  set value(val) {
    val = (String(val)).trim();

    switch (this.type) {
      case 'textarea': // Update textarea content
        this.element.value = val;
        this.html(val);
        break;
      case 'select': // Validate value is an option
        let o, n = 1;

        while ((o = this.child(n++)).length && val !== o.value);
        if (o.length) this.value = val;
        break;
      default:
        this.element.value = val;
        break;
    }
  }

  /**
  *  Get/Set value. It's a chainable alias for the getter/setter
  *  properties
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {number|string} [v] Value to set
  *  @returns {this|boolean|string|undefined}
  *  @see {@link value}
  */
  val(v) {
    if (typeof v !== 'undefined' && v !== null) {
      this.value = v;
      return this;
    }
    return this.value;
  }

  /**
  *  Dirty state
  *
  *  Will be `true` if field value/state have changed
  *  `false` otherwise
  *
  *  @type {boolean}
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @see https://www.sitepoint.com/detect-html-form-changes/
  */
  get dirty() {
    if (
      this.type === 'checkbox' ||
      this.type === 'radio'
    ) return this.node.checked !== this.node.defaultChecked;
    else if (this.type === 'select') {
      let c = false, def = 0, o, ol, opt;

      for (o = 0, ol = this.node.options.length; o < ol; o++) {
        opt = this.node.options[o];
        c = c || (opt.selected !== opt.defaultSelected);
        if (opt.defaultSelected) def = o;
      }
      if (c && !this.node.multiple) c = (def !== this.node.selectedIndex);
    }
    return this.value !== this.node.defaultValue;
  }

  /**
  *  Add a validation rule. Some presets are available :
  *
  *  - `required` : Value must be not empty. Add a `required` attribute to the Element
  *  - `sameas` : Value must be the same than another field. __You must
  *  provide a CSS Selector to query this field as second argument__
  *  - `int` : Strict integer (only numbers)
  *  - `number` : Decimal number (with dot). Change Element type attribute to `number`
  *  - `email` : E-mail pattern. Change Element type attribute to `email`
  *
  *  For custom error messages when validating through browser or programmatically,
  *  you can set the title attribute of the InputElement or provide a message when
  *  creating rule.
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {string}  name  Name of the rule (preset or custom)
  *  @param {string|RegExp|CSSSelector|InputRuleCallback} [pattern]
  *  - Presets will usually don't require this value
  *  - For preset `sameas`, you must provide the required CSS selector
  *  to find the other Element in order to check value.
  *  - For custom rule, you can provide a valid RegExp object or a callback. Any other value
  *  will be evaluated as a RegExp if fourth parameter is set to `true`.
  *  @param {string}  [message]   A message linked to a non validated rule can be store here
  *  @param {boolean} [evaluate = false]  If `true`, the method will try to evaluate
  *  `pattern`parameter as a regular expression. If `false`, it will simply don't create rule
  *  if `pattern` is not a {@link Function} or a {@link RegExp}.
  *  @returns {this} Chainable
  *  @todo  Add more presets
  */
  rule(name, pattern, message, evaluate = false) {
    // Presets
    switch (name) {
      case 'required':
        this._rules.push('required.pattern', /^(?!\s*$).+/);
        this._rules.push('required.message', message || 'FIELD_REQUIRED');
        this.attr('required', 'required');
        break;
      case 'sameas':
        this._rules.push('sameas.pattern', pattern);
        this._rules.push('sameas.message', message || ('FIELD_NOT_MATCHING_' + pattern));
        break;
      case 'int':
        this._rules.push('int.pattern', /^\-?\d+$/);
        this._rules.push('int.message', message || 'FIELD_NOT_INT');
        this.type = 'number';
        break;
      case 'number':
        this._rules.push('number.pattern', /^\-?\d+\.?\d*$/);
        this._rules.push('number.message', message || 'FIELD_NOT_DECIMAL');
        this.type = 'number';
        break;
      case 'email':
        this._rules.push('email.pattern', /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/); //eslint-disable-line
        this._rules.push('email.message', message || 'FIELD_NOT_EMAIL');
        this.type = 'email';
        break;
      default:
        if (pattern instanceof Function) {
          this._rules.push(name + '.callback', pattern);
          this._rules.push(name + '.message', message);
        } else if (pattern instanceof RegExp || evaluate) {
          this._rules.push(name + '.pattern', new RegExp(pattern));
          this._rules.push(name + '.message', message);
        }
    }
    return this;
  }

  /**
  *  Export rules set on the Element
  *
  *  @type {InputValidationRules}
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get rules() {
    return this._rules.data;
  }

  /**
  *  Import rules set on the Element
  *
  *  @type {InputValidationRules}
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  set rules(rules) {
    this._rules.import(rules);
  }

  /**
  *  Validate the field against the rules. Any errors will be logged
  *  in {@link errors} property.
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {boolean} `true`if field validates, `false` otherwise.
  */
  validate() {
    // Reset errors
    this._errors.empty();

    // fix : Some older browsers may returns the placeholder as value
    if (this.value === this.attr('placeholder')) this.value = '';

    return this._rules.reduce(function (validate, v, k) {
      if (k === 'sameas') validate = this.value === Q(v.pattern).value;
      else if (v.pattern) validate = v.pattern.test(this.value);
      else validate = v.callback.call(this, this);
      if (!validate) this._errors.push(k, v.message || this.attr('title'));
      return validate;
    }.bind(this), true);
  }

  /**
  *  Fetch validation errors
  *
  *  @type {Object}
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get errors() {
    return this._errors.data;
  }

  /**
  *  Returns a label HtmlElement linked to this inputElement
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {string} t Text for label
  *  @param {KeyValueObject} o Options for HtmLElement
  *  @returns {HtmlElement} Label
  */
  label(t, o) {
    return Q(`+<label for="${this.name}">${t}</label>`, o);
  }

  /**
  *  Returns a tooltip HtmlElement linked to this inputElement
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {$type} t Text for tooltip
  *  @param {KeyValueObject} o Options for HtmLElement
  *  @returns {HtmlElement} Tooltip
  */
  tooltip(t, o) {
    return Q(`+<span data-for="${this.name}" data-type="tooltip">${t}</span>`, o);
  }
}
