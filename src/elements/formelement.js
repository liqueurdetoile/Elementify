/**
* @file Form classics elements Class
*/

import $ from 'lib/query/q';
import isset from 'lib/utilities/isset';
import foreach from 'lib/utilities/foreach';
import HtmlElement from 'lib/elements/htmlelement';

export default class FormElement extends HtmlElement {
  constructor(node, options) {
    super(node, options);

    this.dirty = false;

    if (this.element.nodeName === 'SELECT' && !isset(this.element.getAttribute('type'))) {
      this.element.setAttribute('type', 'select');
    }
    if (this.element.nodeName === 'TEXTAREA') this.element.setAttribute('type', 'textarea');

    if (this.element.nodeName === 'SELECT' && isset(options.options)) {
      foreach(options.options, (value, label) => this.append('<option value="' + value + '">' + label + '</option>'));
    }
  }

  get value() {
    var ret;

    switch (this.element.getAttribute('type')) {
      case 'checkbox' :
      case 'radio' :
        ret = isset(this.element.checked) ? this.element.value : '';
        break;
      default:
        ret = this.element.value;
        break;
    }
    if (isset(ret)) ret = ret.trim();
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
