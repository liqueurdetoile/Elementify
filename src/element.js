/**
*  @file Element definition class
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

import Collection from 'collection';

import WindowElement from 'elements/windowelement';
import DocumentElement from 'elements/documentelement';
import HtmlElement from 'elements/htmlelement';
import FormElement from 'elements/formelement';
import InputElement from 'elements/inputelement';

/**
*  Element is basically a constructor that will take anything
*  (string, node...) and returns the appropriate Elementify object.
*
*  If the provided input cannot be elementified, it is returned
*  unchanged
*
*  @since 1.0.0
*  @version 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*
*/
class Element {
  /**
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @param {String|Node|HTMLElement} input
  *  @param {keyValueObject} [options = {}] An option/value object that will be passed to the resulting object.
  *  It may contain any HTML attributes and options. See each returned elements for legible values.
  *  @returns {HtmlElement|FormElement|FormInput|FormSelector|FormSwitcher|Collection}
  */
  constructor(input, options = {}) {
    var node;

    if (!input) return new HtmlElement(document.createDocumentFragment(), options);

    if (typeof input === 'string') {
      try {
        node = document.createElement(input);
        return this._nodeToElement(node, options); // Import node
      } catch (e) {
        return this._stringToElements(input, options); // Import tag string
      }
    } else if (input instanceof Node && input.nodeType === 1) { // Import ELEMENT_NODE
      return this._nodeToElement(input, options);
    } else if (input instanceof Node && input.nodeType === 9) { // Import DOCUMENT_NODE
      return new DocumentElement(input, options);
    } else if (input === window) return new WindowElement(options); // Import window

    return input;
  }

  /**
  *  Converts a string to an HtmlElement.
  *  You don't usually need to call directly this method.
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {String} s String value to be converted to an Element
  *  @param {KeyValueObject} [options]
  *  An option/value object that will be passed to the resulting object.
  *  It may contain any HTML attributes and options. See each returned elements for legible values.
  *  @returns {HtmlElement|FormElement|FormInput|FormSelector|FormSwitcher|Collection}
  */
  _stringToElements(s, options = {}) {
    var element, frag;

    try {
      frag = document.createRange().createContextualFragment(s);
    } catch (e) /* istanbul ignore next */ {
      let c = document.createElement('span');

      c.innerHTML = s;
      frag = c;
    }

    if (frag.childNodes.length === 1) {
      element = this._nodeToElement(frag.childNodes.item(0), options);
    } else {
      element = new Collection();
      for (let i = 0; i < frag.childNodes.length; i++) {
        element.push(this._nodeToElement(frag.childNodes.item([i], options)));
      }
    }
    return element;
  }

  /**
  *  Converts a node to an HtmlElement.
  *  You don't usually need to call directly this method.
  *
  *  @method elementify.Element.nodeToElement
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {Node} node Node to import
  *  @param {KeyValueObject} [options]
  *  An option/value object that will be passed to the resulting object.
  *  It may contain any HTML attributes and options. See each returned elements for legible values.
  *  @returns {HtmlElement|FormElement|FormInput|FormSelector|FormSwitcher|Collection}
  */
  _nodeToElement(node, options = {}) {
    var element;

    if (node.nodeType !== 1) return new HtmlElement(document.createDocumentFragment(), options);
    if (node.id) options.id = node.id;
    switch (node.nodeName.toLowerCase()) {
      case 'input':
      case 'select':
      case 'textarea':
      case 'button':
        element = new InputElement(node, options);
        break;
      case 'form':
        element = new FormElement(node, options);
        break;
      default:
        element = new HtmlElement(node, options);
        break;
    }

    return element;
  }
}

export default Element;
