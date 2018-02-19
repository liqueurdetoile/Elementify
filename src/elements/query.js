/**
*  @file Query selector and enhancing elements
*/

import Element from 'elements/element';
import Collection from 'elements/collection';

/**
*  The <tt>Q</tt> function can be used to create Elements,
*  Enhance nodes and query DOM or nodes.
*
*  #### query syntax
*
*  <tt>Q</tt> will returns an empty collection if
*  no elements are found with the given query. A single HtmLElement (or extended
*  Form, FormElement) if there is only one result and a collection if
*  there is more than one result.
*
*  In query mode, the first parameter must be a valid CSS query selector :
*
*  <ul>
*  <li>#idname for single id search will trigger <tt>getElementById</tt></li>
*  <li>.classname for single class search will trigger <tt>getElementsByClassName</tt></li>
*  <li>@elementName for a single name attribute search will trigger <tt>getElementsByName</tt></li>
*  <li>=tagName for a single tag name search will trigger <tt>getElementsByTagName</tt></li>
*  </ul>
*
*  Any others queries will be treated through <tt>querySelectorAll</tt>. For single queries,
*  using the above functions will gnerally be faster than <tt>querySelectorAll</tt>.
*
*  <tt>Q</tt> tweaks the query so you can perform id search in node subset.
*
*  #### Creating and enhancing syntax
*
*  If the first parameter is empty, <tt>Q</tt> will return an HtmlElement with an
*  underlying [DocumentFragment]{@link DocumentFragment}.
*  You can use <tt>Q</tt> as an alias for [Element constructor]{@link elementify.Element}
*  with prepending a <tt>+</tt> on the string node description or providing
*  a valid Element node created with <tt>document.createElement()</tt>.
*
*  Any element node provided to <tt>Q</tt> will be returned enhanced.
*  Any HtmlElement or Collection will be returned as is.
*
*
*  @method elementify.Q
*  @since 1.0.0
*  @version 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*
*  @param {Element|Node|String} [s] Element definition or search query
*  @param {Element|Node|String|ArrayObject} [e] Element options or search context
*  @returns {Collection|HtmlElement}
*/
function Q(s, e) {
  var q, r;

  if (typeof s === 'undefined') return new Element();
  if (s.element) return s;
  if (s.nodeType && s.nodeType === 1) return new Element(s, e);
  if (s[0] === '+') return new Element(s.slice(1), e);

  if (typeof e === 'undefined') {e = document;} else if (e.node) {
    e = e.node;
    // Let ID search into a node
    if (s[0] === '#') s = s.replace('#', '[id="') + '"]';
  }

  try {
    q = e[ {
      '#': 'getElementById',
      '.': 'getElementsByClassName',
      '@': 'getElementsByName',
      '=': 'getElementsByTagName'
    }[ s[0] ] ](s.slice(1));
  } catch (ex) {
    try {
      q = e.querySelectorAll(s);
    } catch (ex) { console.log(e); }
  }

  if (q === null) return new Collection();

  if (typeof q !== 'undefined' && typeof q.length !== 'undefined') {
    if (q.nodeName && q.nodeName === 'FORM') return new Element(q);
    if (q.length > 1) {
      r = new Collection();
      r.query = s;
      for (let i = 0; i < q.length; i++) r.push(new Element(q.item([i])));
    } else if (q.length === 1) {
      r = new Element(q.item([0]));
    } else return new Element();
  } else r = new Element(q);
  return r;
}

export default Q;
