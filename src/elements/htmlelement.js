/**
*  @file HTML Element class
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

import Element from 'elements/element';
import Collection from 'elements/collection';
import ObjectArray from 'dot-object-array';

import $ from 'elements/query';
import hash from 'utilities/hash';

const eventsManager = new ObjectArray();

/**
*  @classdesc
*  This a the basic common class for all HTML elements. It will provide all functionnalities to :
*  - Explore and manipulate the DOM
*  - Create, edit, delete properties on the object
*  - Style the object
*  - Fade in and out
*  - Get and set position
*  - Add event with a global events manager
*
*  All other classed (Form, FormElement...) are extending this class
*
*
*  __You cannot not use directly this class constructor but the Element class constructor that will
*  call the right class given the node type (HTML, Form...).__
*
*  The <tt>options</tt> passed to the Element constructor are then passed to this class constructor.
*
*  @class HtmlElement
*  @since 1.0.0
*  @version 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*
*  @param
*  {Node}
*  node
*  HTML node
*  @param
*  {keyValueObject}
*  [options={}]
*  Options for the HTMLElement object and/or attributes for
*  the underlying native HTMLElement Object. Excepting <tt>data</tt>, <tt>events</tt>,
*  <tt>innerhtml</tt> and <tt>options</tt>, any property of this object will be
*  added as attribute to the underlying HTML object.
*     @param
*     {String|Array}
*     [options.class]
*     Class(es) to be set as value for the <tt>class</tt> attribute.
*
*     @param
*     {String|keyValueObject}
*     [options.style]
*     Style(s) to be set as value for the <tt>style</tt> attribute.
*
*     @param
*     {keyValueObject}
*     [options.data]
*     An object with key/value pairs
*
*  @returns {HtmlElement} New HTMLElement object
*/

class HtmlElement {
  constructor(node, options = {}) {
    /**
    *  The underlying DOM node object
    *
    *  @alias HtmlElement~element
    *  @type {Node}
    *  @since 1.0.0
    */
    this.element = node;

    /**
    *  Convenience property to check if the object
    *  is an instance of this class
    *
    *  @alias HtmlElement~enhanced
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
    *  @alias HtmlElement~length
    *  @type {Number}
    *  @since 1.0.0
    */
    this.length = node.nodeType === 11 ? 0 : 1;

    /**
    *  The options passed to the constructor
    *
    *  @alias HtmlElement~options
    *  @type {ObjectArray}
    *  @since 1.0.0
    *
    *  @param {$type} options Description for options
    *  @returns {type} Return description
    */
    this.options = new ObjectArray(options);

    // Set attributes
    if (this.node.setAttribute) {
      this.options.forEach((value, attr) => {
        attr = attr.toLowerCase();
        if (attr !== 'data' && attr !== 'innerhtml' && attr !== 'events' && attr !== 'options') {
          if (attr === 'class' && value instanceof Array) value = value.join(' ');
          if (attr === 'style' && typeof value !== 'string') value = new ObjectArray(value).styleString();
          this.element.setAttribute(attr, value);
        }
      });
    }

    if (options.innerHTML) this.element.innerHTML = options.innerHTML;
    if (options.data) this.data(options.data);
    if (options.events) this.registerEvents(options.events);
  }

  /**
  *  @method HtmlElement~forEach
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
  *  @method HtmlElement~attr
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {Void|String|Array|keyValueObject} a Attribute(s)
  *  @param {Void|Null|Number|String} v Value for the attribute
  *  @returns {HtmlElement|Number|String|keyValueObject} Self for chaining for setter or attributes for getter
  */
  attr(a = null, v) {
    if (a === null) {
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
  *  @method HtmlElement~data
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {void|String|keyValueObject} a Data attribute name (without the leading <tt>data-</tt> and in camelCase)
  *  @param {Number|String|Object} v Value for the attribute
  *  @returns {HtmlElement|Number|String|Object|keyValueObject}
  *  Self for chaining for setter or data attribute(s) values for getter
  */
  data(a = null, v) {
    // Polyfill dataset
    if (!this.node.dataset) {
      import(/* webpackChunkName: "element-dataset" */ 'element-dataset');
    }

    if (a === null) {
      let datas = {};

      a = new ObjectArray(this.node.dataset);
      a.forEach(function (value, key) { datas[key] = value; });
      return datas;
    }
    if (a instanceof Array) {
      let ret = {};

      a.forEach(function (key) {ret[key] = this.data(key);}.bind(this));
      return ret;
    }
    if (a instanceof Object) {
      a = new ObjectArray(a);
      a.forEach((value, key) => this.data(key, value));
    } else if (v) this.node.dataset[a] = v;
    else if (v === null) delete this.node.dataset[a];
    else return this.node.dataset[a];
    return this;
  }

  /**
  *  Matches returns true if the element matches the query selector
  *
  *  @method HtmlElement~matches
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String} Selector Valid DOM query selector
  *  @returns {Boolean} <tt>True</tt> if Element matches selector
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
  *  @method HtmlElement~parent
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {Number|String}  [n=1]   Distance to the current Element if number. Query selector if string.
  *  @returns {HtmlElement|DocumentFragment}  If the parent level is above top level, it will returns a DocumentFragment
  *  @example
  * el.parent() //returns the first parent above the HtmlElement
  * el.parent(1) //returns the first parent above the HtmlElement
  * el.parent(3) //returns the third parent above the HtmlElement
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
  *  @method HtmlElement~parents
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
  *  @method HtmlElement~child
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
  *  @method HtmlElement~childs
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String} selector A valid DOM query selector
  *  @returns {Collection|HtmlElement|DocumentFragment} HtmlElement or DocumentFragment if no child matches the selector
  */
  childs(selector) {
    return $(selector, this);
  }

  /**
  *  Element's previous sibling finder
  *
  *  @method HtmlElement~previousSibling
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {$type} [n=1] Distance to current Element
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
  *  @method HtmlElement~previousSiblings
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
  *  @method HtmlElement~nextSibling
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {$type} [n=1] Distance to current Element
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
  *  @method HtmlElement~nextSiblings
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
  *  @method HtmlElement~append
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
  *  @method HtmlElement~prepend
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
  *  @method HtmlElement~before
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String|Node|HtmlElement} e Element to insert
  *  @param {Boolean} [returnself=true]  If <tt>true</tt>, it will return the Element.
  *  If <tt>false</tt>, it will return the parent Element.
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
  *  @method HtmlElement~after
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String|Node|HtmlElement} e Element to insert
  *  @param {Boolean} [returnself=true]  If <tt>true</tt>, it will return the Element.
  *  If <tt>false</tt>, it will return the parent Element.
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
  *  @method HtmlElement~wrap
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String|Node|HtmlElement} e=null Wrapping Element
  *  @param {Boolean} [returnself=true] If <tt>true</tt>, it will return the Element.
  *  If <tt>false</tt>, it will return the parent Element.
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
  *  @method HtmlElement~unwrap
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
  *  @method HtmlElement~empty
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
  *  @method HtmlElement~remove
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
  *  @method HtmlElement~html
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
  *  This is provided as a kind of polyfill
  *
  *  @type {String}
  *  @alias HtmlElement~outerHtml
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
  *  @method HtmlElement~clone
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
  *  @method HtmlElement~shallow
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
  *  @alias HtmlElement~isInDom
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
  *  returns <tt>null</tt> instead of <tt>undefined</tt>
  *
  *  @type {Node}
  *  @alias HtmlElement~node
  *  @see HtmlElement~element
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
  *  because it will mostly be a <tt>document</tt> object
  *  which is not a Node object.
  *
  *  @type {Document|Node}
  *  @alias HtmlElement~root
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  */
  get root() {
    var parent;
    var root;

    if (!this.length) return this.node;

    parent = this.node.parentNode;
    if (this.node && parent) {
      while (parent !== null) {
        root = parent;
        parent = parent.parentNode;
      }
      return root;
    }
    return null;
  }

  /**
  *  Get the computed styles
  *
  *  @type {CSSStyleDeclaration}
  *  @alias HtmlElement~styles
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  */
  get styles() {
    return getComputedStyle(this.node);
  }

  /**
  *  Get the visibility of an HtmlElement
  *  If the element is not in DOM, will return <tt>false</tt>
  *
  *  @type {Boolean}
  *  @alias HtmlElement~visible
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  */
  get visible() {
    if (!this.isInDom) return false;
    return this.styles.display !== 'none';
  }

  /**
  *  Get/Set style properties of an HtmlElement.
  *  They are multiple syntaxes allowed dor convenience.
  *
  *  @method HtmlElement~style
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String|Array|ObjectArray} arr Style or array of styles
  *  @param {String} v Value of the style
  *  @returns {HtmlElement} Returns self for chaining
  *  @example
  *  var e = new Element('<div style="color:red;margin:1em"></div>');
  *  e.style('color'); // returns 'red'
  *  e.style('color', 'yellow'); // Set color to yellow and returns e for chaining
  *  e.style(['color', 'margin']); // returns {color:'red', margin: '1em'}
  *  e.style({color: 'yellow', padding: '5px'}); // Set color to yellow, padding to 5px and returns e for chaining
  */
  style(arr, v = null) {
    const _this = this;

    if (typeof arr === 'string') {
      if (v === null) return this.node.style[arr];
      this.node.style[arr] = v;
    } else if (arr instanceof Array) {
      let ret = new ObjectArray();

      arr.forEach(key => ret.push(key, _this.node.style[key]));
      return ret;
    } else {
      arr = new ObjectArray(arr);
      arr.forEach(function (val, key) { _this.node.style[key] = val; });
    }
    return this;
  }

  /**
  *  Set the display style property of an HtmlElement
  *
  *  @method HtmlElement~display
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
  *  @method HtmlElement~hide
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String}  Value for display property
  *  @returns {HtmlElement} Self for chaining
  */
  hide() {
    return this.display('none');
  }

  /**
  *  Show an HtmlElement by setting its display property.
  *  The property value can be override for custom results (e.g. 'flex')
  *
  *  @method HtmlElement~show
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
  *  @method HtmlElement~show
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
  *  @method HtmlElement~hasClass
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String}  c   Class name
  *  @param {String}  [...] Additional(s) class(es) name(s)
  *  @returns {Boolean} True if class(es) are present
  */
  hasClass(c) {
    let args = new ObjectArray(arguments);
    let classes = this.node.className.split(' ');
    let ret = true;

    args.forEach(function (cl, index) { if (classes.indexOf(cl) === -1) ret = false; });
    return ret;
  }

  /**
  *  Add class(es) to an HtmlElement
  *
  *  @method HtmlElement~addClass
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String}  c   Class name
  *  @param {String}  [...] Additional(s) class(es) name(s)
  *  @returns {HtmlElement} Self for chaining
  */
  addClass(c) {
    let args = new ObjectArray(arguments);
    let classes = this.node.className.split(' ');

    args.foreach((cl, index) => { if (classes.indexOf(cl) === -1) classes.push(cl);});
    this.node.className = classes.join(' ');

    return this;
  }

  /**
  *  Remove class(es) from an HtmlElement
  *
  *  @method HtmlElement~removeClass
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String}  c   Class name
  *  @param {String}  [...] Additional(s) class(es) name(s)
  *  @returns {HtmlElement} Self for chaining
  */
  removeClass(c) {
    let args = new ObjectArray(arguments);
    let classes = this.node.className.split(' ');

    args.forEach((cl, index) => { if (classes.indexOf(cl) >= 0) classes.splice(index, 1); });
    this.node.className = classes.join(' ');

    return this;
  }

  /**
  *  Toggle class(es) from an HtmlElement
  *
  *  @method HtmlElement~toggleClass
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String}  c   Class name
  *  @param {String}  [...] Additional(s) class(es) name(s)
  *  @returns {HtmlElement} Self for chaining
  */
  toggleClass(c) {
    let args = new ObjectArray(arguments);

    args.forEach((index, cl) => {
      if (this.hasClass(cl)) this.removeClass(cl);
      else this.addClass(cl);
    });
  }

  /**
  *  Fade In element given a linear easing
  *
  *  @method HtmlElement~fadeIn
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {ObjectArray} options Options for the animation
  *  @param {String}  [options.display='block'] Value for the display CSS property
  *  @param {Number}  [options.duration=400]  Duration of the animation in milliseconds
  *  @param {Callback}  callback  Animation callback
  *  @returns {Promise} Animation promise
  */
  fadeIn(options = {}, callback = null) {
    var p, _this = this;

    this.element.style.opacity = 0;
    this.show(options.display);
    options.duration = options.duration || 400;

    p = new Promise((resolve, reject) => {
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
          resolve(_this);
        }
      }

      window.requestAnimationFrame(animate);
    });

    if (callback instanceof Function) p.then(el => callback(el));

    return p;
  }

  /**
  *  Fade Out element given a linear easing
  *
  *  @method HtmlElement~fadeIn
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {ObjectArray} options Options for the animation
  *  @param {String}  [options.display='none'] Value for the display CSS property
  *  at the end of the animation
  *  @param {Number}  [options.duration=400]  Duration of the animation in milliseconds
  *  @param {Callback}  callback  Animation callback
  *  @returns {Promise} Animation promise
  */
  fadeOut(options = {}, callback = null) {
    var p, _this = this;

    this.element.style.opacity = 1;
    options.display = options.display || 'none';
    options.duration = options.duration || 400;
    p = new Promise((resolve, reject) => {
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
          resolve(_this);
        }
      }

      window.requestAnimationFrame(animate);
    });

    if (callback instanceof Function) p.then(el => callback(el));

    return p;
  }

  // Geometrics
  _positionRefresh() {
    this._position = this.node.getBoundingClientRect();
    this._position.scrollX = (window.pageXOffset !== undefined) ?
      window.pageXOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    this._position.scrollY = (window.pageYOffset !== undefined) ?
      window.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollTop;

    if (!this._position.width) this._position.width = this._position.right - this._position.left;
    if (!this._position.height) this._position.height = this._position.bottom - this._position.top;
  }

  get position() {
    if (!this.isInDom) {
      return {
        left: null,
        right: null,
        width: null,
        top: null,
        bottom: null,
        height: null,
        scrollX: null,
        scrollY: null
      };
    }

    if (!this._position) {
      this._positionRefresh();
      window.addEventListener('resize', this._positionRefresh().bind(this));
      window.addEventListener('orientationchange', this._positionRefresh().bind(this));
    }

    return this._position;
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

  // EVENTS with IE Polyfill
  on(event, callback, capture = false) {
    const id = callback.name ? callback.name : hash(callback.toString());

    if (this.elements) {
      this.elements.forEach(element => element.on(event, callback, capture));
      return this;
    }

    if (this.element.addEventListener) {
      this.element.addEventListener(event, callback, capture);
    } else if (this.element.attachEvent) {
      this.element.attachEvent(event, callback);
    }

    eventsManager.push(`${this.element.id}.${event}.${id}`, {
      callback: callback,
      capture: capture
    });

    return this;
  }

  off(event = null, callback = null, capture = false) {
    if (this.elements) {
      this.elements.forEach(element => element.off(event, callback, capture));
      return this;
    }

    if (!event) {
      let element = this.node.cloneNode(true);

      this.element = element;
      eventsManager.remove(this.element.id);
    } else if (!callback) {
      eventsManager.forEach((action, id) => {
        if (this.element.removeEventListener) {
          this.element.removeEventListener(event, action.callback, action.capture);
        } else if (this.element.detachEvent) {
          this.element.detachEvent(event, action.callback);
        }
      }, `${this.element.id}.${event}`);
      eventsManager.remove(`${this.element.id}.${event}`);
    } else {
      let cbkId = callback.name || hash(callback.toString());

      eventsManager.forEach((action, id) => {
        if (id === cbkId) {
          if (this.element.removeEventListener) {
            this.element.removeEventListener(event, action.callback, capture);
          } else if (this.element.detachEvent) {
            this.element.detachEvent(event, action.callback);
          }
          eventsManager.remove(`${this.element.id}.${event}.${id}`);
        }
      }, `${this.element.id}.${event}`);
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
    } else if (document.createEventObject) { // IE < 9
      event = document.createEventObject();
      event.eventType = eventName;
    }

    event.eventName = eventName;

    if (element.dispatchEvent) {
      element.dispatchEvent(event);
    } else if (element.fireEvent && htmlEvents['on' + eventName]) { // IE < 9
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
    if (event) {
      if (eventsManager[this.node.id]) return eventsManager[this.node.id][event];
      return {};
    }
    return eventsManager[this.element.id];
  }

  registerEvents(events) {
    events = new ObjectArray(events);
    events.forEach(function (callback, event) { this.on(event, callback); });
  }
}

export default HtmlElement;
