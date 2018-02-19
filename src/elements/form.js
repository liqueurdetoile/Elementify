/**
*  @file Form
*/

import HtmlElement from 'elements/htmlelement';
import $ from 'elements/query';

export default class Form extends HtmlElement {
  constructor(node, options = {}) {
    options.method = options.method || 'POST';
    super(node, options);
  }

  field(f) {
    return $('@' + f, this.element);
  }

  get fields() {
    return $('*input:not(.form-ignore), select:not(.form-ignore), ' +
      'textarea:not(.form-ignore), button:not(.form-ignore)', this.element);
  }

  get dirty() {
    var dirty = false;

    this.fields.forEach(function (field) { if (field.dirty) dirty = true; });
    return dirty;
  }

  validate() {
    var validate = true;

    this.fields.forEach(function (field) {
      if (!field.validate()) {
        validate = false;
        field.addClass('field-not-validate').removeClass('field-validate');
      } else field.removeClass('field-not-validate').addClass('field-validate');
    });
    return validate;
  }

  reset() {
    this.fields.forEach(field => field.reset());
  }

  submit() {
    this.element.submit();
  }

  serialize() {
    var ret = '';

    this.fields.forEach((field) => {
      let name = field.element.name || field.element.id;

      if (ret !== '') ret += '&';
      ret += name + '=' + encodeURIComponent(field.value);
    });

    return ret;
  }

  formData() {
    var data = new FormData();

    this.fields.forEach((field) => {
      let name = field.element.name || field.element.id;

      data.append(name, field.value);
    });

    return data;
  }

  get data() {
    var ret = {};

    this.fields.forEach((field) => {
      let name = field.element.name || field.element.id;

      ret[name] = field.value;
    });

    return ret;
  }

  json() {
    return JSON.stringify(this.data);
  }
}
