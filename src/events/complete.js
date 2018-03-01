/**
*  @file Complete event for elementify
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

/**
*  Returns a promise fullfilled when document is at complete state
*  meaning all assets have been loaded
*
*  @since 1.0.0
*  @version 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*
*  @param {Function}  callback  Callback to be run when event fired
*  @returns {undefined|Promise}
*  @example
*  // With promise
*  complete().then(function() { console.log('Assets loaded !') });
*
*  // With callback
*  complete(function() { console.log('Assets loaded !') });
*
*/

export default function complete(callback) {
  function process(resolve, reject) {
    if (document.readyState === 'complete') {
      if (callback instanceof Function) callback();
      resolve(true);
    } else {
      document.addEventListener('readystatechange', (ev) => {
        if (document.readyState === 'complete') {
          if (callback instanceof Function) callback(ev);
          resolve(true);
        }
      });
    }
  }

  if (typeof Promise !== 'undefined') return new Promise(process);
  return process(()=>{}, ()=>{});
}
