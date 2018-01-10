/**
*  @file Switch element
*/

import Element from 'lib/elements/element';
import FormElement from 'lib/elements/formelement';
import isset from 'lib/utilities/isset';

export default class Switcher extends FormElement {
  constructor(node, options = {}) {

    super(node, options);
    this.options = options;

    if (!isset(this.options.button)) this.options.button = {};
    this.options.button.on = this.options.button.on || 'ON';
    this.options.button.off = this.options.button.off || 'OFF';

    this.container = new Element('div', {
      class: 'switcher-container'
    });

    this.input = this.node;
    this.element = this.container.node;

    this.switcher = new Element('button', {
      type: 'button',
      class: 'form-ignore switcher-button',
      events: {
        click: this.toggle.bind(this)
      }
    });
    this.container.append(this.input).append(this.switcher);

    this.init = true;
    this.value = this.options.value || 0;
    this.dirty = false;
    this.init = false;
  }

  get value() {
    return this.input.value;
  }

  set value(val) {
    val = parseInt(val, 10);
    if (val !== 0 && val !== 1) throw new TypeError('Invalid value for switcher');
    this.input.value = val;
    if (val) this.switcher.html(this.options.button.on);
    else this.switcher.html(this.options.button.off);
    if (!this.init) {
      this.fire('change', this.input);
      this.dirty = true;
    }
  }

  toggle() {
    if (this.value === '1') this.value = 0;
    else this.value = 1;
  }
}
