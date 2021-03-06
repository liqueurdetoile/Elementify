/**
*  @file FormElement definition class
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

import ObjectArray from 'dot-object-array';
import HtmlElement from 'elements/htmlelement';
import Q from 'query';

/**
*  A FormElement instance node may contains only `<form>` Element.
*
*  Its main purpose is to provide an easy way to validate a whole form and prepare
*  data for submission
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @todo
*
*  - Add support for binary data
*/

export default class FormElement extends HtmlElement {
  /**
  *  The form constructor
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @private
  *  @param {Element} node Form Element
  *  @param {KeyValueObject} [options = {}]
  *  @returns {FormElement}
  *  @see https://developer.mozilla.org/fr/docs/Web/HTML/Element/Form
  */
  constructor(node, options = {}) {
    super(node, options);

    /**
    *  Errors after validation
    *
    *  @type {ObjectArray}
    *  @since 1.0.0
    */
    this._errors = new ObjectArray();
  }

  /**
  *  Returns a field by its name
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {string} f  Field name
  *  @returns {InputElement}
  */
  field(f) {
    return Q('@' + f, this.node);
  }

  /**
  *  Returns a Collection of all fields. The collection is
  *  dynamic and regenerated by querying.
  *  To ignore an input Element, just add class 'form-ignore' to it.
  *
  *  @type {Collection}
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get fields() {
    return Q('input:not(.form-ignore), select:not(.form-ignore), ' +
      'textarea:not(.form-ignore), button:not(.form-ignore)', this.element);
  }

  /**
  *  Dirty state of the form. Set by fetching all dirty
  *  properties of the form's fields.
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @type {boolean}
  */
  get dirty() {
    var dirty = false;

    this.fields.forEach(function (field) { if (field.dirty) dirty = true; });
    return dirty;
  }

  /**
  *  Validate the form by validating each field rule.
  *  The class `field-validate` is added to validated fields Element
  *  otherwise class `field-not-validate` is added to the Element
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @see {@link InputElement}
  *  @returns {Boolean} `true`if validation is OK, `false` otherwise
  */
  validate() {
    this._errors.empty();

    this.fields.forEach(function (field) {
      if (!field.validate()) {
        field.addClass('field-not-validate').removeClass('field-validate');
        this._errors.push(field.name, field.errors);
      } else field.removeClass('field-not-validate').addClass('field-validate');
    }.bind(this));

    return this._errors.length() === 0;
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
  *  Form data as an {@link ObjectArray} object
  *
  *  @type {ObjectArray}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get datas() {
    let data = new ObjectArray();

    this.fields.forEach(function (field) {
      if (typeof field.value !== undefined) data.push(field.name, field.value);
    });
    return data;
  }

  /**
  *  Import data into form fields
  *  from a {@link KeyValueObject} or an {@link ObjectArray} object
  *
  *  @type {keyValueObject|ObjectArray}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  set datas(o) {
    let data = new ObjectArray(o).flatten(true);

    data.forEach(function (v, f) {
      this.field(f).value = v;
    }.bind(this));
  }

  /**
  *  Data of the form serialized in urlEncode standard. This
  *  string is suitable for a query part or an URI.
  *
  *  @type {string}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get urlEncode() {
    return this.datas.urlEncode();
  }

  /**
  *  Data of the form serialized in urlEncode standard. This
  *  string is suitable for a form-url-encoded data submission
  *
  *  @type {string}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get formUrlEncode() {
    return this.datas.formUrlEncode();
  }

  /**
  *  Form data as a {@link FormData} object
  *
  *  @type {FormData}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get formData() {
    var fd = new FormData();

    this.datas.forEach(function (v, k) { fd.append(k, v); });
    return fd;
  }

  /**
  *  Data of the form returned as a JSON string
  *
  *  @type {string}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get json() {
    return JSON.stringify(this.datas.data);
  }

  /**
  *  Import data into form fields from JSON
  *
  *  @type {string}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @throws {TypeError}
  */
  set json(j) {
    try {
      this.datas = JSON.parse(j);
    } catch (e) {
      throw new TypeError('Argument is not a valid JSON string');
    }
  }
}
