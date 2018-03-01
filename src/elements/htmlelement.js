/**
*  @file HtmlElement definition class
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

import ObjectArray from 'dot-object-array';
import Element from 'element';
import Collection from 'collection';
import EventifiedElement from 'elements/eventifiedelement';

import Q from 'query';

/**
*  This the common class for all other elements. It provides all functionalities to :
*  - Explore and manipulate the DOM
*  - Create, edit, delete properties on the object
*  - Style the object
*  - Fade in and out
*  - Get and set position
*  - Add event with a global events manager
*
*  __You cannot directly create an instance of the class.__
*
*  You must use the {@link Element} constructor or its alias {@link Q}
*  that will then instantiate the right class given the node type (HTML, Form...).
*
*  The `options` passed to the Element constructor are then passed to this class constructor.
*
*  @since 1.0.0
*  @version 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*
*/

export default class HtmlElement extends EventifiedElement {
  /**
  *  Constructor for HTMLElement class
  *
  *  You can pass any attributes as options. There are a few reserved keywords
  *  for specific options.
  *
  *  @private
  *  @param {Element} node Element to enhance
  *  @param {keyValueObject} [options={}]
  *  Options for the HTMLElement object and/or attributes for
  *  the underlying native HTMLElement Object. Excepting `data`, `events`,
  *  `innerhtml` and `options`, any property of this object will be
  *  added as attribute to the underlying HTML object.
  *     @property
  *     {String|Array}
  *     [options.class]
  *     Class(es) to be set as value for the `class` attribute.
  *
  *     @property
  *     {String|keyValueObject}
  *     [options.style]
  *     Style(s) to be set as value for the `style` attribute.
  *
  *     @property
  *     {keyValueObject}
  *     [options.data]
  *     An object with key/value pairs
  *
  *     @property {keyValueObject} [options.events]
  *     Events to add to the element under the format : `{eventName: callback, ...}`
  *
  *  @returns {HtmlElement} New HTMLElement object
  */
  constructor(node, options = {}) {

    super();

    /**
    *  The underlying DOM node object
    *
    *  @type {Node}
    *  @since 1.0.0
    */
    this.element = node;

    /**
    *  Convenience property to check if the object
    *  is an instance of this class
    *
    *  @type {Boolean}
    *  @since 1.0.0
    */
    this.enhanced = true;

    /**
    *  The length property if useful to quickly check what kind
    *  of underlying node object have been returned :
    *  - 0 means it's a DocumentFragment
    *  - 1 means it's a node (HTMLElement...)
    *  - More than 1 means it's a Collection (@see elementify.Collection)
    *
    *  @type {Number}
    *  @since 1.0.0
    */
    this.length = node.nodeType === 11 ? 0 : 1;

    /**
    *  The options passed to the constructor
    *  @type {ObjectArray}
    *  @since 1.0.0
    */
    this.options = new ObjectArray(options);

    // Set attributes
    if (this.node.setAttribute) {
      this.options.forEach((value, attr) => {
        attr = attr.toLowerCase();
        if (attr !== 'data' && attr !== 'innerhtml' && attr !== 'events' && attr !== 'options') {
          if (attr === 'class' && value instanceof Array) value = value.join(' ');
          if (attr === 'style' && typeof value !== 'string') value = new ObjectArray(value).stylesToString();
          this.node.setAttribute(attr, value);
        }
      });
    }

    if (options.innerHTML) this.node.innerHTML = options.innerHTML;
    if (options.data) this.data(options.data);
    if (options.events) this.registerEvents(options.events);
  }

  /**
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @description
  *  Implemented for compatibility with Collection class {@see Collection} for chaining purposes
  *
  *  @param {forEachCallback} callback Callback function to be run on each element.
  *  @returns {void}
  */
  forEach(callback) {
    callback.call(this, this, 0);
  }

  /**
  *  Get or set given attribute(s) of the element.
  *
  *  The getter can be used in two ways :
  *  - A string will return an attribute value
  *  - Array of attributes names will return a keyValueObject
  *
  *
  *  The setter can be used in three ways :
  *  - A string + value will set the attribute
  *  - A string + null will delete the attribute
  *  - A keyValueObject of attributes/values for multiple settings
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {Void|String|Array|keyValueObject} [a] Attribute(s)
  *  @param {Void|Null|Number|String} v Value for the attribute
  *  @returns {HtmlElement|Number|String|keyValueObject} Self for chaining for setter or attributes for getter
  */
  attr(a, v) {
    if (typeof a === 'undefined') {
      let attrs = this.node.attributes;
      let ret = {};

      for (let i = 0; i < attrs.length; i++) ret[attrs[i].name] = attrs[i].value;
      return ret;
    }
    if (a instanceof Array) {
      let ret = {};

      a.forEach(function (attr) { ret[attr] = this.attr(attr); }.bind(this));
      return ret;
    } else if (a instanceof Object) {
      a = new ObjectArray(a);
      a.forEach((value, attr) => { this.attr(attr, value); });
    } else {
      if (v === null) this.node.removeAttribute(a);
      if (v) this.node.setAttribute(a, v);
      else return this.node.getAttribute(a);
    }
    return this;
  }

  /**
  *  Get or set data attribute(s) of the element.
  *
  *  With no arguments, it will return a keyValueObject with all data attributes.
  *
  *  Data items name will be automatically converted from dash to camel-case if needed.
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {undefined|String|Array|Object|ObjectArray} [a] Data attribute name (without leading `data-`)
  *  @param {Number|String|Object} v Value for the attribute
  *  @returns {HtmlElement|Number|String|Object|keyValueObject}
  *  Self for chaining for setter or data attribute(s) values for getter
  */
  data(a, v) {
    const data = new ObjectArray(this.attr());

    // Load data attributes
    data.forEach((v, k) => {
      if (k.indexOf('data-') === -1) data.remove(k);
      else data.push(k.replace('data-', ''), v).remove(k);
    });

    // Check case
    if (typeof a === 'undefined') return data.dataset();
    else if (typeof a === 'string') {
      // Dashize a for camel-cased key request
      a = data.dashize(a);

      if (typeof v === 'undefined') return data.pull(a, undefined, false);
      else if (v === 'null') {
        this.attr('data-' + a, null);
      } else {
        this.attr('data-' + a, v);
        return this;
      }
    } else if (a instanceof Array) {
      let ret = {};

      a.forEach(function (v) { ret[v] = this.data(v); }.bind(this));
      return ret;
    } else if (a instanceof Object) {
      a = new ObjectArray(a);
      a.forEach(function (v, k) { this.data(k, v); }.bind(this));
    } return this;
  }

  /**
  *  Matches returns true if the element matches the query selector
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String} selector Valid DOM query selector
  *  @returns {Boolean} `true` if Element matches selector
  */
  matches(selector) {
    var matches, i;

    if (this.node.matches) return this.node.matches(selector);
    matches = (document || this.node.ownerDocument).querySelectorAll(selector);
    i = matches.length;
    while (--i >= 0 && matches.item(i) !== this.node) {}
    return i > -1;
  }

  /**
  *  Element's n-th parent finder
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {Number|String}  [n=1]   Distance to the current Element if number. Query selector if string.
  *  @returns {HtmlElement|DocumentFragment}  If the parent level is above top level, it will returns a DocumentFragment
  */
  parent(n = 1) {
    var parent = new Element(this.node.parentNode);

    if (typeof n === 'string') return this.parents(n);
    while (n > 1 && parent.length) {
      parent = new Element(parent.node.parentNode);
      n--;
    }
    return parent;
  }

  /**
  *  Element's parent finder based on a DOM query selector
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String} selector A valid DOM query selector
  *  @returns {Collection|HtmlElement|DocumentFragment}
  *  HtmlElement or DocumentFragment if no parent matches the selector
  */
  parents(selector) {
    let coll = new Collection();
    let parent = this.parent();

    while (parent.length) {
      if (parent.matches(selector)) coll.push(parent);
      parent = parent.parent();
    }

    if (coll.length === 0) return new Element();
    if (coll.length === 1) return coll.elements[0];
    return coll;
  }

  /**
  *  Element's nth child finder
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {Number}  [n=1]   Distance to the current Element
  *  @returns {HtmlElement|DocumentFragment}  If the child is unreachable, it will returns a DocumentFragment
  */
  child(n = 1) {
    let childs = this.node.children || this.node.childNodes;

    if (typeof n === 'string') return this.childs(n);

    if (childs && childs[n - 1]) return new Element(childs[n - 1]);
    return new Element();
  }

  /**
  *  Element's childs finder based on a DOM query selector
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String} selector A valid DOM query selector
  *  @returns {Collection|HtmlElement|DocumentFragment} HtmlElement or DocumentFragment if no child matches the selector
  */
  childs(selector) {
    return Q(selector, this);
  }

  /**
  *  Element's previous sibling finder
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {Qtype} [n=1] Distance to current Element
  *  @returns {HtmlElement|DocumentFragment} If the sibling is unreachable, it will returns a DocumentFragment
  */
  previousSibling(n = 1) {
    let ps = this.node.previousSibling;
    let index = 0;

    if (typeof n === 'string') return this.previousSiblings(n);

    while (ps !== null) {
      if (ps.nodeType === 1) index++;
      if (index === n) break;
      ps = ps.previousSibling;
    }

    return new Element(ps);
  }

  /**
  *  Element's previous siblings finder based on a DOM query selector
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String} selector A valid DOM query selector
  *  @returns {Collection|HtmlElement|DocumentFragment} DocumentFragment if no siblings matches the selector
  */
  previousSiblings(selector) {
    let coll = new Collection();
    let ps = this.previousSibling();

    while (ps.length) {
      if (ps.matches(selector)) coll.push(ps);
      ps = ps.previousSibling();
    }

    if (coll.length === 0) return document.createDocumentFragment();
    if (coll.length === 1) return coll.elements[0];
    return coll;
  }

  /**
  *  Element's next sibling finder
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {Qtype} [n=1] Distance to current Element
  *  @returns {HtmlElement|DocumentFragment} If the sibling is unreachable, it will returns a DocumentFragment
  */
  nextSibling(n = 1) {
    let ns = this.node.nextSibling;
    let index = 0;

    if (typeof n === 'string') return this.nextSiblings(n);

    while (ns !== null) {
      if (ns.nodeType === 1) index++;
      if (index === n) break;
      ns = ns.nextSibling;
    }

    return new Element(ns);
  }

  /**
  *  Element's next siblings finder based on a DOM query selector
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String} selector A valid DOM query selector
  *  @returns {Collection|HtmlElement|DocumentFragment} DocumentFragment if no siblings matches the selector
  */
  nextSiblings(selector) {
    let coll = new Collection();
    let ns = this.nextSibling();

    while (ns.length) {
      if (ns.matches(selector)) coll.push(ns);
      ns = ns.previousSibling();
    }

    if (coll.length === 0) return document.createDocumentFragment();
    if (coll.length === 1) return coll.elements[0];
    return coll;
  }

  /**
  *  Append an element to another
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String|Node|HtmlElement} e Element to append (enhanced or not)
  *  @returns {HtmlElement} Return self for chaining
  */
  append(e) {
    if (!e.enhanced) e = new Element(e);
    this.node.appendChild(e.node);
    return this;
  }

  /**
  *  Prepend an element to another
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String|Node|HtmlElement} e Element to prepend (enhanced or not)
  *  @returns {HtmlElement} Return self for chaining
  */
  prepend(e) {
    if (!e.enhanced) e = new Element(e);
    if (this.node.children.length) this.node.insertBefore(e.node, this.node.firstChild);
    else this.node.appendChild(e.node);
    return this;
  }

  /**
  *  Insert an element before another. A Documentfragement wrapper will be
  *  inserted if Element have no parent node.
  *
  *  The second parameter can be used to get the parent element for
  *  chaining instead of the element itself.
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String|Node|HtmlElement} e Element to insert
  *  @param {Boolean} [returnself=true]  If `true`, it will return the Element.
  *  If `false`, it will return the parent Element.
  *  @returns {HtmlElement} Return for chaining
  */
  before(e, returnself = true) {
    if (!e.enhanced) e = new Element(e);
    if (!this.node.parentNode) this.wrap(new Element());
    this.node.parentNode.insertBefore(e.node, this.node);
    return (returnself ? this : new Element(this.node.parentNode));
  }

  /**
  *  Insert an element before another. A Documentfragement wrapper will be
  *  inserted if Element have no parent node.
  *
  *  The second parameter can be used to get the parent element for
  *  chaining instead of the element itself.
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String|Node|HtmlElement} e Element to insert
  *  @param {Boolean} [returnself=true]  If `true`, it will return the Element.
  *  If `false`, it will return the parent Element.
  *  @returns {HtmlElement} Return for chaining
  */
  after(e, returnself = true) {
    if (!e.enhanced) e = new Element(e);
    if (!this.node.parentNode) this.wrap(new Element());
    this.node.parentNode.insertBefore(e.node, e.node.nextSibling);
    return (returnself ? this : new Element(this.node.parentNode));
  }

  /**
  *  Wrap an Element into another.
  *  If no Element provided, the wrapper will be set to
  *  a DocumentFragment node.
  *
  *  The second parameter can be used to get the parent element for
  *  chaining instead of the element itself.
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String|Node|HtmlElement} e=null Wrapping Element
  *  @param {Boolean} [returnself=true] If `true`, it will return the Element.
  *  If `false`, it will return the parent Element.
  *  @returns {HtmlElement} Return for chaining
  */
  wrap(e = null, returnself = true) {
    if (!e.enhanced) e = new Element(e);
    this.after(e);
    e.append(this);
    return (returnself ? this : e);
  }

  /**
  *  Unwrap an Element (and its siblings) and delete its parentNode
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {HtmlElement} Return for chaining
  */
  unwrap() {
    if (this.parent().length) {
      let parent = this.parent();

      this.parent().before(this);
      parent.remove();
    }
    return this;
  }

  /**
  *  Empty an Element
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {HtmlElement} Return for chaining
  */
  empty() {
    while (this.node.firstChild) this.node.removeChild(this.node.firstChild);
    return this;
  }

  /**
  *  Remove an Element
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {HtmlElement} Return for chaining
  */
  remove() {
    if (this.node.parentNode) this.node.parentNode.removeChild(this.node);
    return this;
  }

  /**
  *  Get/Set the HTML content of the node
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String} [v] Value for HTML content
  *  @returns {HTMLElement|string} Setter returns self for chaining, getter returns the string
  */
  html(v) {
    if (v) {
      this.node.innerHTML = v;
      return this;
    }
    return this.node.innerHTML;
  }

  /**
  *  Get the outerHTML string of the underlying node
  *
  *  @type {String}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  */
  get outerHTML() {
    var ret, wrapper = new Element('span');

    if (!this.length) return this.node;
    this.wrap(wrapper);
    ret = this.node.parentNode.innerHTML;
    this.unwrap();
    return ret;
  }

  /**
  *  Returns a deep clone of the HtmlElement. The clone will
  *  contains the same child nodes.
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {HtmlElement} Clone of the current HtmlElement
  */
  clone() {
    return new Element(this.node.cloneNode(true));
  }

  /**
  *  Returns a shallow copy of the HtmlElement
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {HtmlElement} Shallow copy of the current HtmlElement
  */
  shallow() {
    return new Element(this.node.cloneNode(false));
  }

  /**
  *  Check if the HtmlElement is present in DOM
  *
  *  @type {Boolean}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  */
  get isInDom() {
    return this.root === document;
  }

  /**
  *  Alias for the element property member that
  *  returns `null` instead of `undefined`
  *
  *  @type {Node}
  *  @see {@link HtmlElement#element}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get node() { // Alias for element
    return (this.element) ? this.element : null;
  }

  /**
  *  Get the root Node element for the HtmlElement
  *  The result is not enhanced as an HtmlElement
  *  because it will mostly be a `document` object
  *  which is not a Node object.
  *
  *  @type {Document|Node}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  */
  get root() {
    var root;

    if (!this.length) return this.node;

    root = this.node;
    while (root.parentNode) root = root.parentNode;
    return root;
  }

  /**
  *  Get the computed styles of the underlying node.
  *  __Use with care : It can be painfully slow and must be avoided
  *  for huge set of automated ops on style__
  *
  *  @type {CSSStyleDeclaration}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  */
  get styles() {
    return getComputedStyle(this.node);
  }

  /**
  *  Get/Set style properties of an HtmlElement based on its
  *  node `style` attribute.
  *
  *  Properties name will be camelized when read from style string and
  *  dashed when set to style string.
  *
  *  Many syntaxes are available. See examples.
  *
  *  You can remove a style property by setting its value to `null`
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String|Array|Object|ObjectArray}  [a]  get/set request on style attribute
  *
  *  - Empty: style will returns all styles set in the stye attribute
  *  - String : Name or the style property to get or set if second parameter is provided
  *  - Array: Array of properties names to get
  *  - Object|ObjectArray : Properties names and values to set. If second parameter is set
  *  to true, it will replace all styles properties defined in the style attribute. Otherwise
  *  it will merge them
  *
  *  @param {String} [v] Value of the style or enable replace mode
  *  @returns {HtmlElement|String|Object}
  *  Returns self for chaining for set cases,
  *  String or Object {styleKey: styleValue, ...} for get cases
  *  @example
  *  var e = new Element('<div style="color:red;margin:1em"></div>');
  *  e.style('color'); // returns 'red'
  *  e.style('color', 'yellow'); // Set color to yellow and returns e for chaining
  *  e.style(['color', 'margin']); // returns {color:'red', margin: '1em'}
  *  e.style({color: 'yellow', padding: '5px'}); // Set color to yellow, padding to 5px and returns e for chaining
  *  e.style({paddingLeft: '10px', margin: '5px'}); // Set color to yellow, padding to 5px and returns e for chaining
  */
  style(a, v) {
    let o = new ObjectArray();

    // undefined case (getter)
    if (typeof a === 'undefined') {
      o.stringToStyles(this.attr('style'));
      return o.data;
    }
    // String case (getter or setter)
    if (typeof a === 'string') {
      a = o.camelize(a); // camelize property name
      if (typeof v === 'undefined') return this.node.style[a];
      this.node.style[a] = v;
      return this;
    }
    // Array case (getter)
    if (a instanceof Array) {
      let ret = {};

      o.stringToStyles(this.attr('style'));
      a.forEach(function (k) {
        k = o.camelize(k);
        ret[k] = o.dataset(k);
      });
      return ret;
    }
    // Object or ArrayObject case (setter)
    if (a instanceof Object) {
      if (v) this.attr('style', o.import(a).stylesToString());
      else this.attr('style', o.stringToStyles(this.attr('style')).import(a).stylesToString());
      return this;
    }

    return undefined;
  }

  /**
  *  Get the visibility of an HtmlElement. It will only return
  *  false if the element is out of the DOM or with
  *  a display style property set to none.
  *
  *  __Use with care : It can be painfully slow and must be avoided
  *  for huge set of automated ops on elements if display property is not set inline__
  *
  *  @type {Number}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  */
  get visible() {
    return (this.isInDom && this.style('display') !== undefined && this.style('display') !== 'none') ||
      (this.isInDom && this.styles.display !== 'none');
  }

  /**
  *  Set the display style property of an HtmlElement
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String}  [v]   Value for display property
  *  @returns {HtmlElement} Self for chaining
  */
  display(v) {
    if (this.node.style) this.node.style.display = v;
    return this;
  }

  /**
  *  Hide an HtmlElement by setting its display property to 'none'.
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {HtmlElement} Self for chaining
  */
  hide() {
    return this.display('none');
  }

  /**
  *  Show an HtmlElement by setting its display property.
  *  The property value can be override for custom results (e.g. 'flex')
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String}  [v='block']   Value for display property
  *  @returns {HtmlElement} Self for chaining
  */
  show(v = 'block') {
    return this.display(v);
  }

  /**
  *  Toggle an HtmlElement visibility by setting its display property.
  *  The "show" property value can be override for custom results (e.g. 'flex')
  *
  *  __Use with care : It can be painfully slow and must be avoided
  *  for huge set of automated ops on elements if display property is not set inline__
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String}  [v='block']   Value for display property when set to visible
  *  @returns {HtmlElement} Self for chaining
  */
  toggle(v = 'block') {
    if (this.node.style) {
      if (this.styles.display === 'none') this.show(v);
      else this.hide();
    }
  }

  /**
  *  Check if an HtmLElement have given class(es)
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String}  cls   Class(es) name(s)
  *  @returns {Boolean} True if class(es) are present
  */
  hasClass(...cls) {
    let className = this.node.className ? this.node.className.split(' ') : [];
    let ret = true;

    cls.forEach(function (c) { if (className.indexOf(c) === -1) ret = false; });
    return ret;
  }

  /**
  *  Add class(es) to an HtmlElement
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String}  cls   Class(es) name(s)
  *  @returns {HtmlElement} Self for chaining
  */
  addClass(...cls) {
    let className = this.node.className ? this.node.className.split(' ') : [];

    cls.forEach(c => { if (className.indexOf(c) === -1) className.push(c);});
    this.node.className = className.join(' ');

    return this;
  }

  /**
  *  Remove class(es) from an HtmlElement
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String}  cls   Class(es) name(s)
  *  @returns {HtmlElement} Self for chaining
  */
  removeClass(...cls) {
    let className = this.node.className ? this.node.className.split(' ') : [];

    cls.forEach((c) => {
      let i = className.indexOf(c);

      if (i >= 0) className.splice(i, 1);
    });
    this.node.className = className.join(' ');

    return this;
  }

  /**
  *  Toggle class(es) from an HtmlElement
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String}  cls   Class(es) name(s)
  *  @returns {HtmlElement} Self for chaining
  */
  toggleClass(...cls) {
    cls.forEach(c => {
      if (this.hasClass(c)) this.removeClass(c);
      else this.addClass(c);
    });
    return this;
  }

  /**
  *  Fade In element given a linear easing
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {ObjectArray} options Options for the animation
  *  @param {String}  [options.display='block'] Value for the display CSS property
  *  @param {Number}  [options.duration=400]  Duration of the animation in milliseconds
  *  @param {Callback}  callback  Animation callback
  *  @returns {this | Promise} Chainable or animation promise if available
  */
  fadeIn(options = {}, callback = null) {
    var p, _this = this;

    function animationPromise(resolve, reject) {
      var start = null;

      function animate(timestamp) {
        var opacity;

        if (start === null) start = timestamp;
        // Linear easing
        opacity = (timestamp - start) / options.duration;
        _this.element.style.opacity = opacity;
        if (opacity < 1) window.requestAnimationFrame(animate);
        else {
          _this.element.style.opacity = 1;
          if (callback instanceof Function) callback(_this);
          resolve(_this);
        }
      }

      window.requestAnimationFrame(animate);
    }

    this.element.style.opacity = 0;
    this.show(options.display);
    options.duration = options.duration || 400;

    if (typeof Promise !== 'undefined') p = new Promise(animationPromise);
    else animationPromise(() => {});

    return p ? p : this;
  }

  /**
  *  Fade Out element given a linear easing
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {ObjectArray} options Options for the animation
  *  @param {String}  [options.display='none'] Value for the display CSS property
  *  at the end of the animation
  *  @param {Number}  [options.duration=400]  Duration of the animation in milliseconds
  *  @param {Callback}  callback  Animation callback
  *  @returns {this | Promise} Chainable or animation promise if available
  */
  fadeOut(options = {}, callback = null) {
    var p, _this = this;

    function animationPromise(resolve, reject) {
      var start = null;

      function animate(timestamp) {
        var opacity;

        if (start === null) start = timestamp;
        // Linear easing
        opacity = 1 - (timestamp - start) / options.duration;
        _this.element.style.opacity = opacity;
        if (opacity > 0) window.requestAnimationFrame(animate);
        else {
          _this.element.style.opacity = 0;
          _this.display(options.display);
          if (callback instanceof Function) callback(_this);
          resolve(_this);
        }
      }

      window.requestAnimationFrame(animate);
    }

    this.element.style.opacity = 0;
    this.show(options.display);
    options.duration = options.duration || 400;

    if (typeof Promise !== 'undefined') p = new Promise(animationPromise);
    else animationPromise(() => {});

    return p ? p : this;
  }

  /**
  *  Refresh position object at first call or after
  *  a resize / changeOrientation event
  *
  *  @private
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {void}
  */
  _metricsUpdate() {
    let metrics = this.node.getBoundingClientRect();

    this._metrics = {};
    for (let k in metrics) if (typeof metrics[k] === 'number') this._metrics[k] = metrics[k];
    this._metrics.outerWidth = this._metrics.right - this._metrics.left;
    this._metrics.outerHeight = this._metrics.bottom - this._metrics.top;
    this._metrics.width = this.node.clientWidth;
    this._metrics.height = this.node.clientHeight;

    // Update right property to match right offset
    this._metrics.right = document.body.clientWidth - this._metrics.right;
    // Update bottom property to match bottom offset
    this._metrics.bottom = document.body.clientHeight - this._metrics.bottom;

    // Call scroll update
    this._scrollUpdate();
  }

  _scrollUpdate() {
    if (typeof (this._metrics !== 'undefined')) {
      this._metrics.scrollX =
        (window.pageXOffset !== undefined) ?
          window.pageXOffset :
          (document.documentElement || document.body.parentNode || document.body).scrollLeft;

      this._metrics.scrollY =
        (window.pageYOffset !== undefined) ?
          window.pageYOffset :
          (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }
  }

  _parseDims(v) {
    if (v === null || typeof v === 'undefined') return '';
    else if (v === parseInt(v, 10)) return v + 'px';
    else if (typeof v === 'string') return v;
    throw new TypeError('Invalid value for NodeMetrics');
  }

  /**
  *  Get the position property of the element. The calculation only occurs
  *  at first call or when window is resized, rotated or scrolled.
  *
  *  __ Warning : Calculations can be pretty slow on huge amount of elements __
  *
  *  A cached version of the result is available in the `_metrics` property of the
  *  HtmlElement. It will be only be generated after a first call to position or another
  *  getter/setter. It will then be regenerated after events that affect window size or scroll
  *
  *  If the element is not in DOM, all values will return undefined.
  *
  *  @type {NodeMetrics}
  *  @readonly
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get position() {
    if (!this.isInDom) {
      return {
        left: undefined,
        right: undefined,
        width: undefined,
        top: undefined,
        bottom: undefined,
        height: undefined,
        scrollX: undefined,
        scrollY: undefined
      };
    }

    if (typeof this._metrics === 'undefined') {
      this._metricsUpdate();
      window.addEventListener('resize', this._metricsUpdate.bind(this));
      window.addEventListener('orientationchange', this._metricsUpdate.bind(this));
      window.addEventListener('scroll', this._scrollUpdate.bind(this));
      window.addEventListener('touchmove', this._scrollUpdate.bind(this));
    }

    return this._metrics;
  }

  /**
  *  Get scroll X offset of the window in pixels
  *
  *  @see {@link position}
  *  @type {Number|undefined}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get scrollX() {
    return this.position.scrollX;
  }

  /**
  *  Get scroll Y offset of the window in pixels
  *
  *  @see {@link position}
  *  @type {Number|undefined}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get scrollY() {
    return this.position.scrollY;
  }

  /**
  *  Get left offset in pixels (relative to wiewport)
  *
  *  @see {@link position}
  *  @type {Number|undefined}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get left() {
    return this.position.left;
  }

  /**
  *  Set left offset in pixels (relative to wiewport)
  *
  *  You can set value by assigning any of :
  *
  *  - `null`, `undefined` : Remove value
  *  - {Number} : Value will be interpreted in pixels
  *  - {String} : any css acceptable value for the property (e.g '5vi', '1em'...)
  *
  *  @see {@link position}
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  set left(v) {
    this.node.style.left = this._parseDims(v);
    return this;
  }

  /**
  *  Get/Set right offset in pixels (relative to wiewport)
  *  You can set value by assigning any of :
  *
  *  - `null`, `undefined` : Remove value
  *  - {Number} : Value will be interpreted in pixels
  *  - {String} : any css acceptable value for the property (e.g '5vi', '1em'...)
  *
  *  @see {@link position}
  *  @type Number|undefined
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get right() {
    return this.position.right;
  }

  set right(v) {
    this.node.style.right = this._parseDims(v);
    return this;
  }

  /**
  *  Get/Set top offset in pixels (relative to wiewport)
  *  You can set value by assigning any of :
  *
  *  - `null`, `undefined` : Remove value
  *  - {Number} : Value will be interpreted in pixels
  *  - {String} : any css acceptable value for the property (e.g '5vi', '1em'...)
  *
  *  @see {@link position}
  *  @type Number|undefined
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get top() {
    return this.position.top;
  }

  set top(v) {
    this.node.style.top = this._parseDims(v);
    return this;
  }

  /**
  *  Get/Set bottom offset in pixels (relative to wiewport)
  *  You can set value by assigning any of :
  *
  *  - `null`, `undefined` : Remove value
  *  - {Number} : Value will be interpreted in pixels
  *  - {String} : any css acceptable value for the property (e.g '5vi', '1em'...)
  *
  *  @see {@link position}
  *  @type Number|undefined
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get bottom() {
    return this.position.bottom;
  }

  set bottom(v) {
    this.node.style.bottom = this._parseDims(v);
    return this;
  }

  /**
  *  Get/Set width in pixels
  *  You can set value by assigning any of :
  *
  *  - `null`, `undefined` : Remove value
  *  - {Number} : Value will be interpreted in pixels
  *  - {String} : any css acceptable value for the property (e.g '5vi', '1em'...)
  *
  *  @see {@link position}
  *  @type Number|undefined
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get width() {
    return this.position.width;
  }

  set width(v) {
    this.node.style.width = this._parseDims(v);
    return this;
  }

  /**
  *  Get/Set height in pixels
  *  You can set value by assigning any of :
  *
  *  - `null`, `undefined` : Remove value
  *  - {Number} : Value will be interpreted in pixels
  *  - {String} : any css acceptable value for the property (e.g '5vi', '1em'...)
  *
  *  @see {@link position}
  *  @type Number|undefined
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  */
  get height() {
    return this.position.height;
  }

  set height(v) {
    this.node.style.height = this._parseDims(v);
    return this;
  }
}
