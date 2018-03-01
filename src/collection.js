/**
*  @file Collection definition class
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

import EventifiedElement from 'elements/eventifiedelement';
import HtmlElement from 'elements/htmlelement';
import Q from 'query';

/**
*  Class for handling a collection of any HtmlElement (or extended) objects.
*
*  A collection is pretty straight forwarding. All methods from HtmlElement class
*  are mapped to a collection to let iterate a call on items from collection itself.
*
*  @since 1.0.0
*  @version 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*/

class Collection {
  /**
  *  A new Collection can be instantiated though it's more likely the result of a query in the DOM.
  *
  *  @returns {Collection} A collection of [HtmlElement]{@link HtmlElement} objects
  */
  constructor() {
    /**
    *  Array of elements contained in the collection (could be empty)
    *  @type {Array}
    *  @since 1.0.0
    */
    this.elements = [];
  }

  /**
  *  Run a callback on each element in the collection.
  *  This method is an alias to this.elements.forEach.
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {ForEachCallback} callback Callback to run on each element
  *  @returns {void}
  */
  forEach(callback) {
    this.elements.forEach((element, index) => callback.call(element, element, index));
  }

  /**
  *  Number of elements in the collection
  *  @type {Number}
  *  @since 1.0.0
  */
  get length() {
    return this.elements.length;
  }

  /**
  *  Push an element into the collection
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param   {Element|HtmlElement} element Element (enhanced ot not) to insert into the collection
  *  @throws  {TypeError}  Throw an error if the argument is not an Element or an HtmlElement
  *  @returns {this} Chainable
  */
  push(element) {
    // Convert Element Node to HtmlElement
    if (element.nodeType === 1) element = Q(element);
    if (element.enhanced) this.elements.push(element);
    else throw new TypeError('Only Element Object can be added to a collection of Elements');
    return this;
  }

  /**
  *  Merge all elements in collection under a DocumentFragment Element
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @type {HtmlElement}
  */
  get element() {
    const container = Q();

    this.elements.forEach(function (element) {
      container.append(element);
    });

    return container.node;
  }

  /**
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @type {HtmlElement}
  *  @see {@link Collection#element}
  */
  get node() {
    return this.element;
  }
}

// Map EventifiedElement and HTMLElement methods to Collection prototype
function map(c) {
  Object.getOwnPropertyNames(c.prototype).forEach(method => {
    const prop = Object.getOwnPropertyDescriptor(c.prototype, method);

    if (
      typeof prop.value === 'function' &&
      method !== 'constructor' &&
      method !== 'forEach'
    ) {
      Collection.prototype[method] = function () {
        let ret = [];

        this.elements.forEach((el) => {
          ret.push(el[method].apply(el, Array.prototype.slice.call(arguments)));
        });
        return ret;
      };
    }
  });
}

map(EventifiedElement);
map(HtmlElement);

export default Collection;
