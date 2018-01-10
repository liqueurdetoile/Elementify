/**
*  @file Query selector and enhancing elements
*/

import Element from 'lib/elements/element';
import Collection from 'lib/elements/collection';
import isset from 'lib/utilities/isset';

export default function (s, e) {
  var q, r;

  try { // Silent fail
    if (!isset(s)) return new Element();

    if (typeof s === 'object') {
      if (s.element) return s;
      return new Element(s);
    }

    if (!isset(e)) {e = document;} else if (e.element) {
      e = e.element;
      if (s[0] === '#') s = s.replace('#', '*[id="') + '"]'; // Replace id search by global search
    }

    q = e[ {
      '#': 'getElementById',
      '.': 'getElementsByClassName',
      '@': 'getElementsByName',
      '=': 'getElementsByTagName'
    }[ s[0] ] || 'querySelectorAll' ](s.slice(1));

    if (!isset(q)) return new Element();

    if (isset(q.length)) {
      if (q.nodeName && q.nodeName === 'FORM') return new Element(q);
      if (q.length > 1) {
        r = new Collection();
        r.query = s;
        for (let i = 0; i < q.length; i++) r.push(new Element(q.item([i])));
      } else if (q.length === 1) {
        r = new Element(q.item([0]));
      } else return new Element();
    } else r = new Element(q);

  } catch (e) { console.log(e); }
  return r;
}
