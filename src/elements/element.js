/**
*  @file Element Class
*/

import Collection from 'elements/collection';
import HtmlElement from 'elements/htmlelement';
import FormElement from 'elements/formelement';
import Form from 'elements/form';
import Selector from 'elements/selector';
import Switcher from 'elements/switcher';

/**
*  The Element class will take any string or node and returns the appropriate enhanced Element object
*
*  @class elementify.Element
*
*  @param
*  {String|Node|HTMLElement}
*  input
*  Description for input
*  @param
*  {keyValueObject}
*  [options = {}]
*  An option/value object that will be passed to the resulting object.
*  It may contain any HTML attributes and options. See each object for legible values.
*  @returns {HtmlElement|Form|FormElement|Selector|Switcher|elementify.Collection}
*/
class Element {
  constructor(input, options = {}) {
    var node;

    if (!input) return new HtmlElement(document.createDocumentFragment(), options);

    if (typeof input === 'string') {
      try {
        node = document.createElement(input);
        return this.nodeToElement(node, options); // Import node
      } catch (e) {
        return this.stringToElements(input, options); // Import tag string
      }
    } else if (input instanceof Node && !input.element) { // Import node
      return this.nodeToElement(input, options);
    }

    return input;
  }

  /**
  *  Converts a string to an Element.
  *  You don't usually need to call directly this method.
  *
  *  @method Element.stringToElements
  *  @private
  *
  *  @param
  *  {String}
  *  s
  *  String value to be converted to an Element
  *
  *  @params
  *  {keyValueObject}
  *  [options = {}]
  *  An option/value object that will be passed to the resulting object.
  *  It may contain any HTML attributes and options. See each object for legible values.
  *  @returns {HtmlElement|Form|FormElement|Selector|Switcher|Collection} Node
  */
  stringToElements(s, options) {
    var element, frag;

    try {
      frag = document.createRange().createContextualFragment(s);
    } catch (e) /* istanbul ignore next */ {
      let c = document.createElement('span');

      c.innerHTML = s;
      frag = c;
    }

    if (frag.childNodes.length === 1) {
      element = this.nodeToElement(frag.childNodes.item(0), options);
    } else {
      element = new Collection(s);
      for (let i = 0; i < frag.childNodes.length; i++) {
        element.push(this.nodeToElement(frag.childNodes.item([i], options)));
      }
    }
    return element;
  }

  /**
  *  Converts an HTML node to an Element.
  *  You don't usually need to call directly this method.
  *
  *  @method Element.nodeToElement
  *  @private
  *
  *  @param
  *  {Node}
  *  node
  *  HTML Node
  *  @param
  *  {keyValueObject}
  *  [options = {}]
  *  An option/value object that will be passed to the resulting object.
  *  It may contain any HTML attributes and options. See each object for legible values.
  *  @returns {HtmlElement|Form|FormElement|Selector|Switcher|Collection} Node
  */
  nodeToElement(node, options = {}) {
    var element;

    if (node.nodeType !== 1) return new HtmlElement(document.createDocumentFragment(), options);
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
}

export default Element;
