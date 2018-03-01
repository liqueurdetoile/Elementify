/**
*  @file Document Element definition class
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

import EventifiedElement from 'elements/eventifiedelement';

export default class DocumentElement extends EventifiedElement {
  constructor(documentNode, options) {
    super();

    this.element = this.node = documentNode;
    this.length = 0;
  }
}
