/**
*  @file Docs file for typedef
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

/**
*  Any vanilla object that is on the form of a paired key/value structure :
*
*  @typedef {Object} KeyValueObject
*  @example
*  {
*   key1: value1,
*   key2: value2,
*   [...],
*   keyN: valueN
*  }
*/

/**
*  A read-only object that parses position and size informations about an HtmlElement.
*  The position is relative to viewport. If you want absolute positionning on a page,
*  you must also use scrollX and scrollY values
*
*  @typedef {Object|DOMRect} NodeMetrics
*
*  @property {Number} left  Left offset from viewport in pixels
*  @property {Number} top  Top offset from viewport in pixels
*  @property {Number} right  Right offset from viewport in pixels
*  @property {Number} bottom  Bottom offset from viewport in pixels
*  @property {Number} width  Width in pixels
*  @property {Number} height  Height in pixels
*  @property {Number} outerWidth  Outer width in pixels
*  @property {Number} outerHeight  Outer height in pixels
*  @property {Number} scrollX Offset of the viewport from left in pixels
*  @property {Number} scrollY Offset of the viewport from top in pixels
*/

/**
*  Object used to store the validation rules on an InputElement.
*  
*  @typedef {Object} InputValidationRules
*  @property  {RegExp|CSSSelector}  pattern Pattern used for regexp or CSS Selector with `sameas`
*  @property  {string}  message   Message stored with the rule (usually an error Key for i18n to user)
*/

/**
*  This callback is used in forEach callback iteration on a Collection.
*
*  The callback is provided with two parameters :
*  - element {{@link HtmlElement}} Current element in the iteration
*  - index {Number}  Index of the current iterated element
*
*  @typedef {Function} ForEachCallback
*/

/**
*  This callback is used in rule validation for InputElement.
*
*  The callback is provided with the InputElement context. You can then call
*  `this.value` to fetch InputElement value.
*  It __must__ return `true` if validates or `false` otherwise.
*
*  @typedef {Function} InputRuleCallback
*  @example
*  var i = new Element('<input type="text">');
*
*  i.rule('myRule', function() {
*     return this.value > 5;
*  }, 'value must be over 5');
*  
*  i.value = 3;
*  i.validate(); // returns false
*  console.log(i.errors); // outputs {myRule: 'value must be over 5'}
* 
*/

/**
*  @external {DOMRect} https://developer.mozilla.org/fr/docs/Web/API/DOMRect
*/
/**
*  @external {Node} https://developer.mozilla.org/fr/docs/Web/API/Node
*/
/**
*  @external {Element} https://developer.mozilla.org/fr/docs/Web/API/Element
*/
/**
*  @external {ObjectArray} https://liqueurdetoile.github.io/DotObjectArray/
*/
/**
*  @external {FormData} https://developer.mozilla.org/en-US/docs/Web/API/FormData
*/
/**
*  @external {RegExp} https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
*/
/**
*  @external {CSSSelector} https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors
*/
