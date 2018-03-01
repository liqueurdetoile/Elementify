/**
*  @file Ready event for elementify
*  @author  Liqueur de Toile <contact@liqueurdetoile.com>
*  @license Apache-2.0 {@link https://www.apache.org/licenses/LICENSE-2.0}
*/

/**
*  Returns a promise fullfilled when document is at interactive state
*  meaning DOM is safe to manipulate
*
*  @since 1.0.0
*  @version 1.0.0
*  @author Liqueur de Toile <contact@liqueurdetoile.com>
*
*  @returns {Promise}
*  @example
*  ready().then(function() { console.log('Can manipulate DOM!') });
*/
export default function ready(callback) {
  function process(resolve, reject) {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      if (callback instanceof Function) callback();
      resolve(true);
    } else {
      document.addEventListener('readystatechange', (ev) => {
        if (document.readyState === 'interactive') {
          if (callback instanceof Function) callback(ev);
          resolve(true);
        }
      });
    }
  }

  if (typeof Promise !== 'undefined') return new Promise(process);
  return process(()=>{}, ()=>{});
}
