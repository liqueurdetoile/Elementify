/**
*  @file Elementify main
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

import Element from 'element';
import Collection from 'collection';
import Q from 'query';

/**
*  Load Elementify names exports into the global scope. Therefore,
*  these functions and objects will be directly accessible.
*
*  You can personnalize the name of the Q function (and
*  may try $ ;)
*
*  @since 1.0.0
*  @version 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @license MIT {@https://github.com/liqueurdetoile/DotObjectArray/blob/master/LICENSE}
*  @see {@link Q}
*
*  @params {String} [Qname='Q'] Name for Q [function]{@link Q} in the global scope.
*/

export default function load(Qname = 'Q') {
  window.Element = Element;
  window.Collection = Collection;
  window[Qname] = Q;
}
