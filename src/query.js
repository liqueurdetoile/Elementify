/**
*  @file Q function definition
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

import Element from 'element';
import Collection from 'collection';

/**
*  The `Q` function can be used to create Elements,
*  enhance nodes and query DOM or nodes. It's the swiss army knife
*  of elementify
*
*  ### query syntax
*
*  `Q` will returns an empty collection if
*  no elements are found with the given query. A single HtmLElement (or extended
*  Form, FormElement) if there is only one result and a collection if
*  there is more than one result.
*
*  In query mode, the first parameter must be a valid CSS query selector :
*
*  <ul>
*  <li>#idname for single id search will trigger `getElementById`</li>
*  <li>.classname for single class search will trigger `getElementsByClassName`</li>
*  <li>@elementName for a single name attribute search will trigger `getElementsByName`</li>
*  <li>=tagName for a single tag name search will trigger `getElementsByTagName`</li>
*  </ul>
*
*  Any others queries will be treated through `querySelectorAll`. For single queries,
*  using the above functions will generally be faster than falling down to `querySelectorAll`.
*
*  `Q` tweaks the query so you can perform id or name search in nodes that are not in DOM.
*
*  The second parameter let restrict the search to a node.
*
*  ### Creating and enhancing syntax
*
*  If the first parameter is empty, `Q` will return an HtmlElement with an
*  underlying {@link DocumentFragment}.
*  You can use `Q` as an alias for [Element constructor]{@link elementify.Element}
*  with prepending a `+` on the string node description or providing
*  a valid Element node created with `document.createElement()`.
*
*  Any element node provided to `Q` will be returned enhanced.
*  Any HtmlElement or Collection will be returned as is.
*
*
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

  // Create/Enhance mode
  if (typeof s === 'undefined') return new Element();
  if (s.enhanced) return s;
  if (s.nodeType || s === window) return new Element(s, e);
  if (s[0] === '+') return new Element(s.slice(1), e);

  // Query mode
  if (typeof e === 'undefined') e = document;
  else if (e.node) e = e.node;

  // Tweak search if e not equal to document
  if (e !== document) {
    // Let ID search into a node
    if (s[0] === '#') s = s.replace('#', '[id="') + '"]';
    // Let name search into a node
    if (s[0] === '@') s = s.replace('@', '[name="') + '"]';
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
    } catch (ex) { throw new TypeError('Invalid CSS query Selector'); }
  }

  if (q === null) return new Element();

  if (
    typeof q !== 'undefined' &&
    typeof q.length !== 'undefined' &&
    q.nodeName !== 'FORM'
  ) {
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
