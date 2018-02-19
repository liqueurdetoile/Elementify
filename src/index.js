/**
*  @file Elementify main file. Import and export modules
*/

// Polyfills
// Add promise support
import 'es6-promise/auto';
if (!window.PointerEvent) import(/* webpackChunkName: "handjs" */ 'handjs');
if (!Function.prototype.bind) import(/* webpackChunkName: "bind" */ 'polyfill-function-prototype-bind');
if (!window.requestAnimationFrame) {
import(
  /* webpackChunkName: "requestanimationframe" */ 'polyfills/requestanimationframe');
}

// Structure
import Element from 'elements/element';
import Collection from 'elements/collection';
import Q from 'elements/query';

export {Collection, Element, Q};

/**
*  @namespace elementify
*
*  @description
*  This is the main exported object enabled in browser mode and for modules import
*/

/**
*  @typedef keyValueObject
*  @type {object}
*  @description
*  Any vanilla object that is on the form of a paired key/value structure :
*  @example
*  {
*   key1: value1,
*   key2: value2,
*   [...],
*   keyN: valueN
*  }
*/

/**
*  @typedef DocumentFragment
*  @see https://developer.mozilla.org/fr/docs/Web/API/DocumentFragment
*/

/**
  * This callback is used in forEach callback.
  * @callback forEachCallback
  * @since 1.0.0
  * @version 1.0.0
  * @author Liqueur de Toile <contact@liqueurdetoile.com>
  * @param {Object|Number|String|Array|HtmlElement} value Value at the <tt>index</tt> offset
  * @param {Number|String} index Index of the Element.
  *  It will be a number for a [Collection]{@link elementify.Collection}
  *  or [HtmlElement]{@link HtmlElement}
  *  and the key for an [ObjectArray]{@link ObjectArray}
  * @param {Number} offset  Offset of the current value in an [ObjectArray]{@link ObjectArray}
  */
