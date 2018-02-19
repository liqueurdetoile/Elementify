/**
* @file Form classics elements Class
*/

import HtmlElement from 'elements/htmlelement';
import $ from 'elements/query';

export default class FormElement extends HtmlElement {
  constructor(node, options = {}) {
    super(node, options);

    this.dirty = false;

    if (this.node.nodeName === 'TEXTAREA') this.node.setAttribute('type', 'textarea');
    if (this.node.nodeName === 'SELECT') {
      this.node.setAttribute('type', 'select');
      if (options.options) {
        for (let key in options.options) {
          this.append('<option value="' + key + '">' + options.options[key] + '</option>');
        }
      }
    }

    if (options.value !== undefined && options.value !== null) {
      this.value = this.defaultValue = options.value;
      this.data('defaultValue', options.value);
    }
  }

  get value() {
    var ret;

    switch (this.element.getAttribute('type')) {
      case 'checkbox' :
      case 'radio' :
        ret = this.element.checked ? this.element.value : '';
        break;
      default:
        ret = this.element.value;
        break;
    }
    if (ret) ret = ret.trim();
    else ret = '';
    return ret;
  }

  set value(val) {
    val = (String(val)).trim();

    switch (this.element.getAttribute('type')) {
      case 'textarea' :
        this.element.value = val;
        this.element.innerHTML = val;
        break;
      default:
        this.element.value = val;
        break;
    }
    this.dirty = true;

    return this;
  }

  get placeholder() {
    return this.element.getAttribute('placeholder');
  }

  set placeholder(val) {
    this.element.setAttribute('placeholder', val);
    return this;
  }

  reset() {
    this.value = this.defaultValue || '';
  }

  validate() {
    var validate = true;

    // IE FIX
    if (this.value === this.placeholder) this.value = '';

    if (this.element.hasAttribute('required')) {
      if (this.value === '') validate = false;
    }

    if (this.element.hasAttribute('sameas')) {
      if (this.value !== $('@' + this.element.getAttribute('sameas')).value) validate = false;
    }

    if (this.element.hasAttribute('rule')) {
      let rule = this.element.getAttribute('rule');

      if (typeof rule === 'string') {
        switch (rule) {
          case 'integer':
            if (!this.value.match(/^\d+$/)) validate = false;
            break;
          case 'email':
          case 'mail':
            // eslint-disable-next-line max-len
            if (!this.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) validate = false;
            break;
        }
      } else if (!this.value.match(rule)) validate = false;
    }

    return validate;
  }
}
