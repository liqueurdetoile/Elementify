/**
*  @file HTML Element class
*/

import anime from 'animejs';
import Element from 'lib/elements/element';
import isset from 'lib/utilities/isset';
import foreach from 'lib/utilities/foreach';
import dashToCamel from 'lib/utilities/dashtocamel';
import camelToDash from 'lib/utilities/cameltodash';
import hash from 'lib/utilities/hash';

const eventsManager = {};

export default class HtmlElement {
  constructor(node, options) {
    options = options || {};

    this.element = node;
    this.length = 1;

    if (isset(this.element.setAttribute)) {
      foreach(options, (attr, value) => {
        var style = '';

        attr = attr.toLowerCase();
        if (attr !== 'data' && attr !== 'innerhtml' && attr !== 'events' && attr !== 'options') {
          if (attr === 'value') this.element.setAttribute('data-default-value', String(value));
          if (attr === 'class' && value instanceof Array) value = value.join(' ');
          if (attr === 'styles') {
            foreach(value, (key, val) => {
              style += key + ': ' + val + '; ';
            });
            attr = 'style';
            value = style;
          }
          this.element.setAttribute(attr, value);
        }
      });
    }

    if (options.innerHTML) this.element.innerHTML = options.innerHTML;
    if (options.data) this.data(options.data);
    if (options.events) this.registerEvents(options.events);
  }

  // Compatibility with collection class
  forEach(callback) {
    callback.call(this, this, 0);
  }

  // ATTRIBUTES AND DATA FUNCTIONS
  attr(a, v) {
    if (a instanceof Object) {
      foreach(a, (attr, value) => { this.node.setAttribute(attr, value); });
    } else if (typeof a === 'string') {
      if (v === null) this.node.removeAttribute(a);
      if (isset(v)) this.node.setAttribute(a, v);
      else return this.node.getAttribute(a);
    }
    return this;
  }

  data(a, v) {
    if (a instanceof Object) {
      foreach(a, (attr, value) => { this.element.setAttribute('data-' + camelToDash(attr), value); });
    } else if (typeof a === 'string') {
      if (v === null) this.element.removeAttribute('data-' + camelToDash(a), v);
      if (isset(v)) this.element.setAttribute('data-' + camelToDash(a), v);
      else return this.element.getAttribute('data-' + camelToDash(a));
    } else {
      let data = {};

      for (let i = 0; i < this.element.attributes.length; i++) {
        let attr = this.element.attributes[i];

        if (attr.name.match(/^data-/)) data[dashToCamel(attr.name.replace(/data-/, ''))] = attr.value;
      }
      return data;
    }
    return this;
  }

  // DOM TREE TRAVERSING
  matches(selector) {
    var matches, i;

    if (this.node.matches) return this.node.matches(selector);
    matches = (document || this.node.ownerDocument).querySelectorAll(selector);
    i = matches.length;
    while (--i >= 0 && matches.item(i) !== this.node) {}
    return i > -1;
  }

  get parent() {
    return new Element(this.element.parentNode);
  }

  parentSelector(selector = null) {
    var element = this.parent;

    if (selector) {
      while (element.node) {
        if (element.matches(selector)) return element;
        element = element.parent;
      }
      return null;
    } return this.parent;
  }

  get firstChild() {
    return new Element(this.node.firstChild);
  }

  // DOM MANIPULATIONS
  append(e, a) {
    if (!isset(e.element)) e = new Element(e, a);
    if (isset(this.element) && isset(e.element)) this.element.appendChild(e.element);
    return this;
  }

  appendTo(domElement) {
    if (domElement instanceof HTMLElement) domElement.appendChild(this.element);
    else if (domElement instanceof HtmlElement) domElement.append(this.element);
    else throw new TypeError('Only HTML Element can be targeted');
    return this;
  }

  prepend(e, a) {
    if (!isset(e.element)) e = new Element(e, a);
    if (isset(this.element)) {
      if (isset(this.element.firstChild)) this.element.insertBefore(e.element, this.element.firstChild);
      else this.element.appendChild(e.element);
    }
    return this;
  }

  prependTo(domElement) {
    if (domElement instanceof HTMLElement) {
      if (isset(domElement.firstChild)) domElement.insertBefore(this.element, domElement.firstChild);
      else domElement.appendChild(this.element);
    } else throw new TypeError('Only HTML Element can be targeted');
    return this;
  }

  before(e, a) {
    if (!isset(e.element)) e = new Element(e, a);
    if (isset(this.element)) {
      if (!isset(this.element.parentNode)) this.wrap(new Element());
      this.element.parentNode.insertBefore(e.element, this.element);
    }
    return this;
  }

  after(e, a) {
    if (!isset(e.element)) e = new Element(e, a);
    if (isset(this.element)) {
      if (!isset(this.element.parentNode)) this.wrap(new Element());
      if (isset(this.element.nextSibling)) {
        this.element.parentNode.insertBefore(e.element, this.element.nextSibling);
      } else this.element.parentNode.appendChild(e.element);
    }
    return this;
  }

  wrap(e, a) {
    if (!isset(e.element)) e = new Element(e, a);
    if (isset(this.element)) {
      if (!isset(this.element.parentNode)) e.append(this);
      else {
        this.before(e);
        this.remove();
        e.append(this);
      }
    }
    return this;
  }

  unwrap() {
    const parentNode = this.node.parentNode;
    const grandParentNode = parentNode ? parentNode.parentNode : undefined;

    if (isset(grandParentNode)) grandParentNode.replaceChild(this.node, parentNode);
  }

  empty() {
    if (this.element) {
      while (this.element.firstChild) {this.element.removeChild(this.element.firstChild);}
    }
    return this;
  }

  remove() {
    if (this.node) {
      if (this.node.parentNode) this.node.parentNode.removeChild(this.node);
    }
    return this;
  }

  html(v) {
    if (isset(v)) {
      this.element.innerHTML = v;
      return this;
    }
    return this.element.innerHTML;
  }

  get outerHtml() {
    var ret, wrapper = new Element('span');

    this.wrap(wrapper);
    ret = this.parent.html();
    this.unwrap();
    return ret;
  }

  // STYLES MANIPULATIONS
  get styles() {
    return window.getComputedStyle(this.element);
  }

  style(arr, v = null) {
    const _this = this;

    if (typeof arr === 'string') {
      if (v === null) return this.node.style[arr];
      this.node.style[arr] = v;
    } else {
      foreach(arr, function (s, v) { _this.node.style[s] = v; });
    }
    return this;
  }

  get visible() {
    return this.styles.display !== 'none';
  }

  display(v) {
    if (isset(this.element.style)) this.element.style.display = v;
    return this;
  }

  hide(v = 'none') {
    return this.display(v);
  }

  show(v = 'block') {
    return this.display(v);
  }

  toggle() {
    if (isset(this.element.style)) {
      if (this.styles.display === 'none') this.show();
      else this.hide();
    }
  }

  addClass(c) {
    if (this.element.classList) this.element.classList.add(c);
    else {
      let classes = this.element.className.split(' ');
      let addClasses = c.split(' ');

      foreach(addClasses, (index, cl) => { if (classes.indexOf(cl) === -1) classes.push(cl);});
      this.element.className = classes.join(' ');
    }
    return this;
  }

  removeClass(c) {
    if (this.element.classList) this.element.classList.remove(c);
    else {
      let classes = this.element.className.split(' ');
      let removeClasses = c.split(' ');

      foreach(removeClasses, (index, cl) => { if (classes.indexOf(cl) >= 0) classes.splice(index, 1); });
      this.element.className = classes.join(' ');
    }
    return this;
  }

  hasClass(c) {
    let classes = this.element.className.split(' ');

    return classes.indexOf(c) >= 0;
  }

  toggleClass(c) {
    if (this.element.classList) this.element.classList.toggle(c);
    else {
      if (this.hasClass(c)) this.removeClass(c);
      else this.addClass(c);
    }
  }

  // Geometrics
  get position() {
    const position = this.node.getBoundingClientRect();

    position.scrollX = (window.pageXOffset !== undefined) ?
      window.pageXOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    position.scrollY = (window.pageYOffset !== undefined) ?
      window.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollTop;

    if (!isset(position.width)) position.width = position.right - position.left;
    if (!isset(position.height)) position.height = position.bottom - position.top;

    return position;
  }

  get scrollX() {
    return this.position.scrollX;
  }

  get scrollY() {
    return this.position.scrollY;
  }

  get left() {
    return this.position.left;
  }

  get right() {
    return this.position.right;
  }

  get top() {
    return this.position.top;
  }

  get bottom() {
    return this.position.bottom;
  }

  get width() {
    return this.position.width;
  }

  get height() {
    return this.position.height;
  }

  set top(v) {
    this.node.style.top = parseInt(v, 10) + 'px';
    return this;
  }

  set bottom(v) {
    this.node.style.bottom = parseInt(v, 10) + 'px';
    return this;
  }

  set left(v) {
    this.node.style.left = parseInt(v, 10) + 'px';
    return this;
  }

  set right(v) {
    this.node.style.right = parseInt(v, 10) + 'px';
    return this;
  }

  set width(v) {
    this.node.style.width = parseInt(v, 10) + 'px';
    return this;
  }

  set height(v) {
    this.node.style.height = parseInt(v, 10) + 'px';
    return this;
  }

  // Animations
  fadeIn(options = {}, callback = null) {
    var a;

    this.element.style.opacity = 0;
    this.show(options.display);

    a = anime({
      targets: this.element,
      opacity: {
        value: 1,
        duration: options.duration || 400,
        easing: 'easeInQuad'
      },
      complete: options.complete
    });

    if (callback instanceof Function) a.finished.then(callback());
    return this;
  }

  fadeOut(options = {}, callback = null) {
    const _this = this;
    const a = anime({
      targets: this.element,
      opacity: {
        value: 0,
        duration: options.duration || 400,
        easing: 'easeOutQuad'
      },
      complete: function () {
        _this.element.style.display = options.display || 'none';
        if (options.complete instanceof Function) options.complete();
      }
    });

    if (callback instanceof Function) a.finished.then(callback());
    return this;
  }

  // GETTERS AND SETTERS
  get clone() {
    return new Element(this.node.cloneNode(true));
  }

  get shallow() {
    return new Element(this.node.cloneNode(false));
  }

  get isInDom() {
    return this.root === document;
  }

  get node() { // Alias for element
    return (this.element) ? this.element : null;
  }

  get root() {
    var parent;
    var root;

    if (this.element) {
      parent = this.element.parentNode;
      while (isset(parent)) {
        root = parent;
        parent = parent.parentNode;
      }
      return root;
    }
    return null;
  }

  // EVENTS with IE >= 9 Polyfill
  on(event, callback, capture) {
    const id = callback.name ? callback.name : hash(callback.toString());

    if (this.elements) {
      this.elements.forEach(element => element.on(event, callback, capture));
      return this;
    }

    capture = capture || false;
    if (this.element.addEventListener) {
      this.element.addEventListener(event, callback, capture);
    } else if (this.element.attachEvent) {
      this.element.attachEvent(event, callback);
    }

    // if (!this.node.id) this.node.id = 'e-' + uniqid();

    if (!isset(eventsManager[this.element.id])) eventsManager[this.element.id] = {};
    if (!isset(eventsManager[this.element.id][event])) eventsManager[this.element.id][event] = {};
    if (!isset(eventsManager[this.element.id][event][id])) {
      eventsManager[this.element.id][event][id] = {
        callback: callback,
        capture: capture
      };
    }

    return this;
  }

  off(event, callback, capture) {
    capture = capture || false;

    if (!isset(event)) {
      let element = this.element.cloneNode(true);

      this.element = element;
      delete eventsManager[this.element.id];
    } else if (!isset(callback)) {
      foreach(eventsManager[this.element.id][event], (id, action) => {
        if (this.element.removeEventListener) {
          this.element.removeEventListener(event, action.callback, action.capture);
        } else if (this.element.detachEvent) {
          this.element.detachEvent(event, action.callback);
        }
      });
      delete eventsManager[this.element.id][event];
      if (!Object.keys(eventsManager[this.element.id]).length) {
        delete eventsManager[this.element.id];
      }
    } else {
      let cbkId = callback.name || hash(callback.toString());

      foreach(eventsManager[this.element.id][event], (id, action) => {
        if (id === cbkId) {
          if (this.element.removeEventListener) {
            this.element.removeEventListener(event, action.callback, capture);
          } else if (this.element.detachEvent) {
            this.element.detachEvent(event, action.callback);
          }
          delete eventsManager[this.element.id][event][id];
          if (!Object.keys(eventsManager[this.element.id][event]).length) {
            delete eventsManager[this.element.id][event];
          }
          if (!Object.keys(eventsManager[this.element.id]).length) {
            delete eventsManager[this.element.id];
          }
        }
      });
    }

    return this;
  }

  fire(eventName, element = window) {
    var event;
    const htmlEvents = window.htmlEvents || [];

    element = element || this.element;
    if (document.createEvent) {
      event = document.createEvent('HTMLEvents');
      event.initEvent(eventName, true, true);
    } else if (document.createEventObject) {// IE < 9
      event = document.createEventObject();
      event.eventType = eventName;
    }

    event.eventName = eventName;

    if (element.dispatchEvent) {
      element.dispatchEvent(event);
    } else if (element.fireEvent && htmlEvents['on' + eventName]) {// IE < 9
      element.fireEvent('on' + event.eventType, event); // can trigger only real event (e.g. 'click')
    } else if (element[eventName]) {
      element[eventName]();
    } else if (element['on' + eventName]) {
      element['on' + eventName]();
    }

    return this;
  }

  fireCustomEvent(eventName, properties = {}) {
    var event;

    if (window.CustomEvent) {
      event = new CustomEvent(eventName, properties);
      this.node.dispatchEvent(event);
    }
  }

  events(event) {
    if (isset(event)) {
      if (isset([this.element.id])) return eventsManager[this.element.id][event];
      return {};
    }
    return eventsManager[this.element.id];
  }

  registerEvents(events) {
    const _this = this;

    foreach(events, (event, callback) => _this.on(event, callback));
  }
}
