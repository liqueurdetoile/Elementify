/**
*  @file Collection
*/

import HtmlElement from 'lib/elements/htmlelement';

export default class Collection {
  constructor(query) {
    this.query = query;
    this.elements = [];

    // Copy HTMLElement methods to Collection prototype
    Object.getOwnPropertyNames(HtmlElement.prototype).forEach(method => {
      const property = Object.getOwnPropertyDescriptor(HtmlElement.prototype, method);

      if (typeof property.value === 'function' && method !== 'constructor' && method !== 'forEach') {
        Collection.prototype[method] = (a1, a2, a3) => {
          this.elements.forEach((element) => { element[method].call(element, a1, a2, a3); });
        };
      }
    });
  }

  forEach(callback) {
    this.elements.forEach((element, index) => callback.call(element, element, index));
  }

  get length() {
    return this.elements.length;
  }

  push(element) {
    if (!element instanceof Element) {
      throw new TypeError('Only Element Object can be added to a collection of Elements');
    } else this.elements.push(element);
  }

  get element() {
    const container = document.createDocumentFragment();

    this.elements.forEach(function (element) {
      container.appendChild(element.node);
    });

    return container;
  }
}
