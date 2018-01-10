/**
*  @file Element Class
*/

import Collection from 'lib/elements/collection';
import HtmlElement from 'lib/elements/htmlelement';
import FormElement from 'lib/elements/formelement';
import Form from 'lib/elements/form';
import Selector from 'lib/elements/selector';
import Switcher from 'lib/elements/switcher';
import isset from 'lib/utilities/isset';

export default class Element {
  constructor(input, options = {}) {
    var tag;

    if (!isset(input)) return document.createDocumentFragment();

    if (typeof input === 'string') {
      tag = input.match(/^[a-zA-Z]*$/);
      if (isset(tag)) { // Tag is used
        return this.nodeToElement(document.createElement(tag[0]), options);
      }
      // Analyze import string
      return this.stringToElements(input, options);
    } else if (input instanceof Node && !isset(input.element)) { // Import node
      return this.nodeToElement(input, options);
    }

    return input;
  }

  // IMPORT FUNCTIONS
  stringToElements(s, options) {
    var element, frag;

    try {
      frag = document.createRange().createContextualFragment(s);
    } catch (e) {
      let c = document.createElement('span');

      c.innerHTML = s;
      frag = c;
    }

    if (frag.childNodes.length) {
      if (frag.childNodes.length === 1) {
        element = this.nodeToElement(frag.childNodes.item(0));
      } else {
        element = new Collection(s);
        for (let i = 0; i < frag.childNodes.length; i++) {
          element.push(Element.prototype.nodeToElement(frag.childNodes.item([i])));
        }
      }
    }
    return element;
  }

  nodeToElement(node, options) {
    var element;

    options = options || {};
    if (node.id) options.id = node.id;
    switch (node.nodeName.toLowerCase()) {
      case 'input':
      case 'select':
      case 'textarea':
      case 'button':
        element = new FormElement(node, options);
        break;
      case 'form':
        element = new Form(node, options);
        break;
      case 'selector':
        options.type = 'hidden';
        node = document.createElement('input', options);
        element = new Selector(node, options);
        break;
      case 'switcher':
        options.type = 'hidden';
        node = document.createElement('input', options);
        element = new Switcher(node, options);
        break;
      default:
        element = new HtmlElement(node, options);
        break;
    }

    return element;
  }

  collectionToElement(collection) {
    const element = new DocumentFragment();

    collection.forEach((element) => this.append(element));
    return element;
  }
}
