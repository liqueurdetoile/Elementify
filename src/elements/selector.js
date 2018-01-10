/**
*  @File Selector Element
*
*/

import 'lib/elements/selector.sss';
import Element from 'lib/elements/element';
import FormElement from 'lib/elements/formelement';
import isset from 'lib/utilities/isset';
import foreach from 'lib/utilities/foreach';

export default class Selector extends FormElement {
  constructor(node, options) {
    var _this, opts;

    super(node, options);
    this.dirty = false;
    _this = this;

    // Mapping, add wrapping and dropdown
    opts = options;
    delete opts.id;
    delete opts.name;
    if (options.value) opts.value = options.options[options.value];
    opts.type = 'text';
    opts.class = 'form-ignore';
    this.input = new Element('input', opts);

    this.container = new Element('div', {
      class: 'selector-container'
    });

    this.dropdown = new Element('div', {
      class: 'selector-dropdown'
    });

    this.container
      .append(this.element)
      .append(this.input)
      .append(this.dropdown);
    this.input.wrap('<span class="selector-input"></span>');

    this.element = this.container.element;

    this.container.on('click', function (ev) {
      _this.dropdown.show();
      _this.input.element.focus();
    });

    this.dropdown.on('pointerdown', function (ev) {
      _this.selectValue.call(_this, ev);
    });

    this.input.on('blur', function (ev) {
      if (_this.dropdown.nav) ev.preventDefault();
      if (_this.input.value === '') {
        _this.element.firstChild.value = '';
        _this.fire('change', _this.element.firstChild);
      } else {
        for (let i = 0; i < _this.dropdown.element.childNodes.length; i++) {
          let item = _this.dropdown.element.childNodes.item(i);

          if (item.getAttribute('value') === _this.value) _this.input.value = item.innerHTML;
        }
      }
      _this.dropdown.hide();
    });

    this.input.on('input', function (ev) { /* IE HACK */
      if (_this.input.element === document.activeElement) _this.filter.call(_this, ev);
    });
    this.input.on('keydown', function (ev) { _this.nav.call(_this, ev); });

    if (isset(options.options)) this.options(options.options, false);
    if (isset(options.value)) this.value = options.value;
  }

  options(options, changeEvent = true) {
    this.dropdown.empty();
    foreach(options, (value, label) => {
      this.dropdown.append(new Element('div', {
        class: 'selector-dropdown-option',
        value: value,
        innerHTML: label
      }));
    });
    if (changeEvent) this.fire('change', this.element.firstChild);
  }

  get value() {
    return this.element.firstChild.value;
  }

  set value(val) {
    const items = this.dropdown.element.childNodes;

    this.unfilter();
    if (val === '') {
      this.element.firstChild.value = '';
      this.input.element.value = '';
      return true;
    }
    // Check if value exists and set it
    for (let i = 0; i < items.length; i++) {
      let item = this.dropdown.element.childNodes.item(i);

      if (item.getAttribute('value') === val) {
        this.element.firstChild.value = val;
        this.fire('change', this.element.firstChild);
        this.input.element.value = item.innerHTML;
        this.dirty = true;
        return true;
      }
    }
    return false;
  }

  selectValue(e) {
    if (isset(e.target.getAttribute('value'))) {
      this.value = e.target.getAttribute('value');
    }
  }

  get availableDropdownItems() {
    const items = this.dropdown.element.childNodes;
    const visibleItems = [];

    for (let i = 0; i < items.length; i++) {
      if (items.item(i).style.display !== 'none') visibleItems.push(new Element(items.item(i)));
    }

    return visibleItems;
  }

  filter(e) {
    const glob = this.input.value;
    const visibleItems = this.availableDropdownItems;

    if (isset(this.dropdown.nav)) {
      visibleItems[this.dropdown.nav].removeClass('selected');
      delete this.dropdown.nav;
    }

    this.dropdown.show();
    for (let i = 0; i < this.dropdown.element.childNodes.length; i++) {
      let item = this.dropdown.element.childNodes.item(i);

      if (glob === '') item.style.display = 'block';
      else if (item.innerHTML.toLowerCase().indexOf(glob.toLowerCase()) >= 0) item.style.display = 'block';
      else item.style.display = 'none';
    }
  }

  unfilter() {
    for (let i = 0; i < this.dropdown.element.childNodes.length; i++) {
      let item = this.dropdown.element.childNodes.item(i);

      item.style.display = 'block';
    }
  }

  get placeholder() {
    return this.input.element.getAttribute('placeholder');
  }

  set placeholder(val) {
    this.input.element.setAttribute('placeholder', val);
    return this;
  }

  nav(e) {
    const visibleItems = this.availableDropdownItems;

    if (visibleItems.length) {
      switch (e.keyCode) {
        case 40: // Arrow down
          e.preventDefault();
          if (!this.dropdown.visible) {
            this.dropdown.show();
          }
          if (!isset(this.dropdown.nav)) {
            this.dropdown.nav = 0;
            visibleItems[this.dropdown.nav].addClass('selected');
          } else {
            if (this.dropdown.nav >= 1) {
              this.dropdown.element.scrollTop += visibleItems[this.dropdown.nav].element.offsetHeight;
            }
            if (this.dropdown.nav <= (visibleItems.length - 2)) {
              visibleItems[this.dropdown.nav].removeClass('selected');
              this.dropdown.nav++;
              visibleItems[this.dropdown.nav].addClass('selected');
            }
          }
          break;
        case 38: // Arrow up
          e.preventDefault();
          if (this.dropdown.visible && this.dropdown.nav === 0) {
            delete this.dropdown.nav;
            this.dropdown.hide();
          } else if (this.dropdown.nav >= 0) {
            if (this.dropdown.nav <= (visibleItems.length - 2)) {
              this.dropdown.element.scrollTop -= visibleItems[this.dropdown.nav].element.offsetHeight;
            }
            visibleItems[this.dropdown.nav].removeClass('selected');
            this.dropdown.nav--;
            visibleItems[this.dropdown.nav].addClass('selected');
          }
          break;
        case 13: // Enter
        case 32: // Space
          if (this.dropdown.visible) e.preventDefault();
          if (visibleItems[this.dropdown.nav]) {
            this.value = visibleItems[this.dropdown.nav].element.getAttribute('value');
            this.input.element.blur();
          }
          break;
        case 27: // Echap
          e.preventDefault();
          delete this.dropdown.nav;
          this.input.element.blur();
          break;
      }
    }
  }
}
