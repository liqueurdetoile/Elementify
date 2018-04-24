/**
*  @file Events manager class for elementify
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

import ObjectArray from 'dot-object-array';
import Q from 'query';

/**
*  EventsManager class provide an object in order to
*  easily track and manage user-defined events
*  Eventified Elements
*
*  @version 1.0.0
*  @since 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*  @see HtmlElement
*/

export default class EventsManager {
  /**
  *  @version 1.0.0
  *  @since 1.0.0
  *  @returns {EventsManager} Event manager
  */
  constructor() {
    /**
    *  Events storage
    *
    *  @type {ObjectArray}
    *  @since 1.0.0
    */
    this.orm = new ObjectArray();
  }

  /**
  *  Cleans events database from object that are not in DOM anymore.
  *  This method is called each time the events manager is accessed
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @returns {void}
  */
  clean() {
    this.orm.forEach(function (v, k) {
      if (!Q('[data-__id__="' + k + '"]').length) this.orm.remove(k);
    }.bind(this));
  }

  /**
  *  Check if object have event, specific event or specific event/callback
  *  given the `key` parameter value
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {string} [key] All events if not provided or path to the event or event callback
  *  in dotted way
  *  @returns {boolean} `true` if result found
  */
  has(key) {
    this.clean();
    return this.orm.has(key);
  }

  /**
  *  Add and event/callback
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {string} key Event name
  *  @param {Function} val Event callback
  *  @param {string} pKey Context parent key (useless)
  *  @returns {this} Chainable
  */
  push(key, val, pKey) {
    this.clean();
    this.orm.push(key, val, pKey);
    return this;
  }

  /**
  *  Fetch all events, specific event or specific event/callback
  *  given the `key` paramater value
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {string} [key] All events if not provided or path to the event or event callback
  *  in dotted way
  *  @returns {boolean} `true` if result found
  */
  pull(key) {
    this.clean();
    return this.orm.pull(key);
  }

  /**
  *  Remove all events, specific event or specific event/callback
  *  given the `key` paramater value
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {string} [key] All events if not provided or path to the event or event callback
  *  in dotted way
  *  @returns {boolean} `true` if result found
  */
  remove(key) {
    this.clean();
    this.orm.remove(key);
    return this;
  }

  /**
  *  Iterates on all events, specific event or specific event/callback
  *  given the `pKey` paramater value
  *
  *  @version 1.0.0
  *  @since 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {Function}  cb  Callback for iteration
  *  @param {string} [pKey] Context parent key
  *  @returns {boolean} `true` if result found
  */
  forEach(cb, pKey) {
    this.orm.forEach(cb, pKey);
  }
}
