/**
*  @file Eventified Element definition class
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

import ObjectArray from 'dot-object-array';
import EventsManager from 'events/eventsmanager';
import hash from 'utilities/hash';
import uniqid from 'utilities/uniqid';

const eventsManager = new EventsManager();

export default class EventifiedElement {
  _callbackId(callback) {
    if (callback instanceof Function) return callback.name ? callback.name : hash(callback.toString());
    else if (typeof callback === 'string') return callback;
    return undefined;
  }

  /**
  *  Unique id for HtmlElement automatically generated
  *  Its solely purpose is for events tracking
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  */
  get _id() {
    let _id = this.data('__id__') ? this.data('__id__') : uniqid();

    this.data('__id__', _id);
    return _id;
  }

  /**
  *  Attach event to htmlElement node. It is mostly an alias to native
  *  addEventListener with a storage of the registered event.
  *
  *  A good side effect is you cannot [duplicate callbacks with anonymous functions]
  *  (https://triangle717.wordpress.com/2015/12/14/js-avoid-duplicate-listeners).
  *
  *  @method HtmlElement~on
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
  *
  *  @param {String} event Event name
  *  @param {String|Function} callback Callback to run
  *  @param {Boolean} [capture=false] Capture the event
  *  @returns {HtmlElement} Self for chaining
  */
  on(event, callback, capture = false) {
    const cbid = this._callbackId(callback);

    // Prevent attaching event to a documentFragment itself
    if (!this.length) return this;

    // Avoid 2 same callbacks to be attached to an event
    if (!eventsManager.has(`${this._id}.${event}.${cbid}`)) {
      this.element.addEventListener(event, callback, capture);
      eventsManager.push(`${this._id}.${event}.${cbid}`, {
        callback: callback,
        capture: capture
      });
    }

    return this;
  }

  /**
  *  Detach event from htmlElement node. It is mostly an alias to native
  *  removeEventListener with a storage of the registered event
  *
  *  @method HtmlElement~off
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
  *
  *  @param {String} event Event name
  *  @param {String|Function} callback Callback to run
  *  @param {Boolean} [capture=false] Capture the event
  *  @returns {HtmlElement} Self for chaining
  */
  off(event, callback, capture = false) {
    const cbid = this._callbackId(callback);

    if (!this.length) return this;

    if (!event) {
      // Remove all events
      eventsManager.forEach((cb, e) => {
        eventsManager.forEach((action, id) => {
          this.element.removeEventListener(e, action.callback, action.capture);
        }, `${this._id}.${e}`);
      }, this._id);
      eventsManager.remove(this._id);
    } else if (!cbid) {
      // Remove all callbacks linked to event
      eventsManager.forEach((action, id) => {
        this.element.removeEventListener(event, action.callback, action.capture);
      }, `${this._id}.${event}`);
      eventsManager.remove(`${this._id}.${event}`);
    } else { // Remove specific callback
      eventsManager.forEach((action, id) => {
        if (id === cbid) {
          this.element.removeEventListener(event, action.callback, capture);
          eventsManager.remove(`${this._id}.${event}.${cbid}`);
        }
      }, `${this._id}.${event}`);
    }

    return this;
  }

  /**
  *  Fire an event to htmlElement. It is mostly an alias to native
  *  dispatchEvent but with the option to make another element fire the event (it must
  *  be a valid target though)
  *
  *  @method HtmlElement~fire
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
  *
  *  @param {String} event Event name
  *  @param {window|document|node} [element = this.node] Element that is required to fire the event.
  *  If not provided, the underlying node will be the source.
  *  @returns {Boolean} The return value is false if event is cancelable
  *  and at least one of the event handlers which handled this event
  *  called `Event.preventDefault()`. Otherwise it returns true.
  */
  fire(event, element) {
    let e = document.createEvent('HTMLEvents');

    element = element || this.node;
    if (element.node) element = element.node;
    e.initEvent(event, true, true);
    e.eventName = event;
    return element.dispatchEvent(e);
  }

  /**
  *  Check if a listener is set for the element
  *  is already attached to the HtmlElement
  *
  *  @method HtmlElement~hasEvent
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
  *
  *  @param {String} [event] Event name
  *  @param {String|Function} [callback] callback
  */
  hasEvent(event, callback) {
    const cbid = this._callbackId(callback);

    return !event ? eventsManager.has(this._id) :
      !cbid ? eventsManager.has(`${this._id}.${event}`) :
        eventsManager.has(`${this._id}.${event}.${cbid}`);
  }

  /**
  *  Returns the callback(s) attached to element
  *  is already attached to the HtmlElement
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *  @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
  *
  *  @param {String} [event] Event name
  */
  getEvent(event) {
    return !event ? eventsManager.pull(this._id) :
      eventsManager.pull(`${this._id}.${event}`);
  }

  /**
  *  Mass registering for event based on a key/callback object
  *
  *  @since 1.0.0
  *  @version 1.0.0
  *  @author Liqueur de Toile <contact@liqueurdetoile.com>
  *
  *  @param {Object} events Events object to register
  *  @returns {void}
  */
  registerEvents(events) {
    events = new ObjectArray(events);
    events.forEach(function (callback, event) { this.on(event, callback); }.bind(this));
  }
}
